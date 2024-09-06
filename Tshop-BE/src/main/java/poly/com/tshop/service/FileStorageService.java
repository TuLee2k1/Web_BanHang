package poly.com.tshop.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import poly.com.tshop.configuration.FileStorageProperties;
import poly.com.tshop.dto.UploadedFileInfo;
import poly.com.tshop.exception.FileNotFoundException;
import poly.com.tshop.exception.FileStorageException;


import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileProductImageStorageLocation;

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        try {
            String uploadProductDir = fileStorageProperties.getUploadProductImageDir();
            if (uploadProductDir == null || uploadProductDir.isEmpty()) {
                throw new IllegalArgumentException("Upload directory must not be null or empty");
            }

            this.fileProductImageStorageLocation = Paths.get(fileStorageProperties.getUploadProductImageDir())
                    .toAbsolutePath().normalize();

            try {

                if (!Files.exists(fileProductImageStorageLocation)) {
                    Files.createDirectories(fileProductImageStorageLocation);
                }

                Files.createDirectories(fileProductImageStorageLocation);
            }catch (Exception ex){
                throw new FileStorageException("Could not create the directory for storing images", ex);
            }
        }catch (Exception ex){
            throw new FileStorageException("Could not create the directory for storing images", ex);
        }
    }

    public String storeProductImageFile(MultipartFile file) {
        return storeFile(fileProductImageStorageLocation,file);
    }

    private String storeFile(Path location, MultipartFile file) {
        UUID uuid = UUID.randomUUID();

        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = uuid.toString() + "."+ ext;

        try {
            if(fileName.contains("..")){
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = location.resolve(fileName);
            Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        }catch (Exception ex){
            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }

    public UploadedFileInfo storeUploadedProductImageFile(MultipartFile file) {
        return storeUploadedFile(fileProductImageStorageLocation,file);
    }

    private UploadedFileInfo storeUploadedFile(Path location, MultipartFile file) {
        UUID uuid = UUID.randomUUID();

        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = uuid.toString() +"."+ ext;

        try {
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            Path targetLocation = location.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            UploadedFileInfo info = new UploadedFileInfo();
            info.setFilename(fileName);
            info.setUid(uuid.toString());
            info.setName(StringUtils.getFilename(file.getOriginalFilename()));

            return info;

        }catch (Exception exception){
            throw new FileStorageException("Could not store file " + fileName, exception);
        }
    }


    public Resource loadProductImageFileAsResource(String fileName) {
        return loadFileAsResource(fileProductImageStorageLocation, fileName);
    }

    private Resource loadFileAsResource(Path location, String fileName) {
        try {
            Path filePath = location.resolve(fileName).normalize(); // Tạo đường dẫn tệp
            Resource resource = new UrlResource(filePath.toUri());  // Khởi tạo UrlResource mà không cần ép kiểu

            if (resource.exists() && resource.isReadable()) {  // Kiểm tra tệp có tồn tại và có thể đọc được không
                return resource;
            } else {
                throw new FileNotFoundException("File not found or not readable: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("File not found: " + fileName, ex);
        } catch (Exception ex) {
            throw new FileNotFoundException("Could not read file: " + fileName, ex);
        }
    }


    public void deleteProductImageFile(String fileName) {
        deleteFile(fileProductImageStorageLocation, fileName);

    }

    private void deleteFile(Path location, String fileName) {
        try {
            Path filePath = location.resolve(fileName).normalize();

            if (!Files.exists(filePath)){
                throw new FileNotFoundException("File not found " + fileName);
            }
            Files.delete(filePath);
        }catch (Exception ex){
            throw new FileStorageException("Could not delete file " + fileName, ex);
        }
    }
}
