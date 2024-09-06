package poly.com.tshop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import poly.com.tshop.domain.Product;
import poly.com.tshop.dto.ProductDto;
import poly.com.tshop.dto.ProductImageDto;
import poly.com.tshop.exception.FileNotFoundException;
import poly.com.tshop.exception.FileStorageException;
import poly.com.tshop.exception.ProductException;
import poly.com.tshop.repository.ProductRepository;
import poly.com.tshop.service.FileStorageService;
import poly.com.tshop.service.MapValidationErrorService;
import poly.com.tshop.service.ProductService;

import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/products")
@CrossOrigin
public class ProductController {
    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ProductService productService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;
    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDto dto, BindingResult result) {
        ResponseEntity<?> responseEntity = mapValidationErrorService.mapValidationFields(result);

        if (responseEntity != null) {
            return responseEntity;
        }

        var savedDto = productService.insertProduct(dto);

        return new ResponseEntity<>(savedDto, HttpStatus.CREATED);
    }

    @GetMapping("/find")
    public ResponseEntity<?> getProductBriefByName(@RequestParam("query") String query,
                                                   @PageableDefault(size = 2, sort = "name",
            direction = Sort.Direction.ASC) Pageable pageable) {
        return new ResponseEntity<>(productService.getProductBriefByName(query, pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}/getedit")
    public ResponseEntity<?> getEditedProduct(@PathVariable Long id) {
        return new ResponseEntity<>(productService.getEditedProductById(id),HttpStatus.OK);
    }


    @PatchMapping(value = "/{id}/all")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @Valid @RequestBody ProductDto dto,
                                           BindingResult result) {
        System.out.println("updateProduct");

        ResponseEntity<?> responseEntity = mapValidationErrorService.mapValidationFields(result);

        if (responseEntity != null) {
            return responseEntity;
        }
        var updatedDto = productService.updateProduct(id, dto);

        return new ResponseEntity<>(updatedDto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProductById(id);

        return new ResponseEntity<>("Product with ID "+ id + "was deleted",HttpStatus.OK);
    }



    @PostMapping(value = "/images/one",
    consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile imageFile) {
        var fileInfo = fileStorageService.storeUploadedProductImageFile(imageFile);
        ProductImageDto dto = new ProductImageDto();
        BeanUtils.copyProperties(fileInfo, dto);

        dto.setStatus("done");
        dto.setUrl("http://localhost:8080/api/v1/products/images/" + fileInfo.getFilename());

        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping(value = "/images/{filename:.+}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename, HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadProductImageFileAsResource(filename);

            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            }catch (Exception ex){
                throw new FileStorageException("Could not determine file type.");
            }
            if(contentType == null) {
                contentType = "application/octet-stream";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\""
                            + resource.getFilename() + "\"")
                    .body(new InputStreamResource(resource.getInputStream()));
        }catch (FileNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found: " + filename);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/images/{fileName:.+}")
    public ResponseEntity<?> deleteImage(@PathVariable String fileName) {
        fileStorageService.deleteProductImageFile(fileName);

        return new ResponseEntity<>("Image deleted", HttpStatus.OK);
    }
}
