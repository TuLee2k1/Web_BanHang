package poly.com.tshop.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import poly.com.tshop.domain.AbstractEntity;
import poly.com.tshop.domain.Category;
import poly.com.tshop.domain.Product;
import poly.com.tshop.domain.ProductImage;
import poly.com.tshop.dto.ProductBriefDto;
import poly.com.tshop.dto.ProductDto;
import poly.com.tshop.dto.ProductImageDto;
import poly.com.tshop.exception.ProductException;
import poly.com.tshop.repository.ProductImageRepository;
import poly.com.tshop.repository.ProductRepository;
import java.io.File;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Transactional(rollbackOn = Exception.class)
    public ProductDto insertProduct(ProductDto Dto) {
        Product entity = new Product();
        BeanUtils.copyProperties(Dto, entity);

        var cate = new Category();
        cate.setId(Dto.getCategoryId());
        entity.setCategory(cate);
        
        if (Dto.getImage() != null){
            ProductImage image = new ProductImage();
            BeanUtils.copyProperties(Dto.getImage(), image);
            var savedImage = productImageRepository.save(image);
            entity.setImage(savedImage);
        }
        
        if(Dto.getImages() != null && Dto.getImages().size() > 0){
            var entityList = saveProductImages(Dto);
            entity.setImages(entityList);
        }

        var savedProduct = productRepository.save(entity);
        Dto.setId(savedProduct.getId());
        return Dto;
    }

    @Transactional(rollbackOn = Exception.class)
    public ProductDto updateProduct(Long id, ProductDto Dto) {
        var found = productRepository.findById(id).orElseThrow(() -> new ProductException("Product not found"));

        String ignoreFields[] = new String[]{"createdDate", "iamgae", "iamges", "viewCount"};
        BeanUtils.copyProperties(Dto, found, ignoreFields);

        if (Dto.getImage().getId() != null && found.getImage().getId() != Dto.getImage().getId()){
            fileStorageService.deleteProductImageFile(found.getImage().getFilename());

            ProductImage image = new ProductImage();
            BeanUtils.copyProperties(Dto.getImage(), image);

            productImageRepository.save(image);
            found.setImage(image);
        }
        var cate = new Category();
        cate.setId(Dto.getCategoryId());
        found.setCategory(cate);

        if (Dto.getImages().size() > 0){
            var toDeleteFile = new ArrayList<ProductImage>();

            found.getImages().stream().forEach(item -> {
                var exists = Dto.getImages().stream().anyMatch(image -> image.getId() == item.getId());

                if (!exists){
                    toDeleteFile.add(item);
                }
            });

            if (toDeleteFile.size() > 0){
                toDeleteFile.stream().forEach(item -> {
                    fileStorageService.deleteProductImageFile(item.getFilename());
                    productImageRepository.delete(item);
                });
            }

            var imgList = Dto.getImages().stream().map(item -> {
                ProductImage image = new ProductImage();
                BeanUtils.copyProperties(item, image);
                return image;
            }).collect(Collectors.toSet());
            found.setImages(imgList);
        }
        var savedEntity = productRepository.save(found);

        Dto.setId(savedEntity.getId());
        return Dto;
    }


    private Set<ProductImage> saveProductImages(ProductDto Dto) {
    var entityList = new HashSet<ProductImage>();

    var newList = Dto.getImages().stream().map(item ->{
        ProductImage image = new ProductImage();
        BeanUtils.copyProperties(item, image);

        var savedImage = productImageRepository.save(image);
        item.setId(savedImage.getId());

        entityList.add(savedImage);
        return item;
    }).collect(Collectors.toList());

    Dto.setImages(newList);
    return entityList;
    }



    @Transactional(rollbackOn = Exception.class)
    public void deleteProductById(Long id) {
        var found = productRepository.findById(id).orElseThrow(() ->
                new ProductException("Product not found"));

        // Xóa hình ảnh chính nếu có
        if (found.getImage() != null) {
            try {
                String mainImageFilename = found.getImage().getFilename();
                if (mainImageFilename != null && new File(mainImageFilename).exists()) {
                    fileStorageService.deleteProductImageFile(mainImageFilename);
                }
                productImageRepository.delete(found.getImage());
            } catch (Exception e) {
                throw new ProductException("Could not delete main image: " + e.getMessage());
            }
        }

        // Xóa các hình ảnh phụ nếu có
        if (found.getImages() != null && !found.getImages().isEmpty()) {
            found.getImages().forEach(item -> {
                try {
                    String imageFilename = item.getFilename();
                    if (imageFilename != null && new File(imageFilename).exists()) {
                        fileStorageService.deleteProductImageFile(imageFilename);
                    }
                    productImageRepository.delete(item);
                } catch (Exception e) {
                    throw new ProductException("Could not delete additional image: " + e.getMessage());
                }
            });
        }

        // Xóa sản phẩm sau khi đã xử lý hình ảnh
        try {
            productRepository.delete(found);
        } catch (Exception e) {
            throw new ProductException("Could not delete product: " + e.getMessage());
        }
    }




    public Page<ProductBriefDto> getProductBriefByName(String name, Pageable pageable) {
        var list = productRepository.findByNameContainsIgnoreCase(name,pageable);

        var newList = list.getContent().stream().map(item -> {
            ProductBriefDto dto = new ProductBriefDto();
            BeanUtils.copyProperties(item, dto);

            dto.setCategoryName(item.getCategory().getName());
            if (item.getImage() != null) {
                dto.setImageFileName(item.getImage().getFilename());
            } else {
                dto.setImageFileName(null); // Hoặc bạn có thể đặt giá trị mặc định nếu cần
            }


            return dto;
        }).collect(Collectors.toList());

        var newPage = new PageImpl<ProductBriefDto>(newList,list.getPageable(),list.getTotalElements());

        return newPage;
    }

    public ProductDto getEditedProductById(Long id) {
        var found = productRepository.findById(id).orElseThrow(() -> new ProductException("Product not found"));

        ProductDto dto = new ProductDto();
        BeanUtils.copyProperties(found, dto);

        dto.setCategoryId(found.getCategory().getId());

        var images = found.getImages().stream().map(item -> {
            ProductImageDto productImageDto = new ProductImageDto();

            BeanUtils.copyProperties(item, productImageDto);
            return productImageDto;
        }).collect(Collectors.toList());
        dto.setImages(images);

        ProductImageDto imageDto = new ProductImageDto();
        BeanUtils.copyProperties(found.getImage(), imageDto);
        dto.setImage(imageDto);

        return dto;
    }


}
