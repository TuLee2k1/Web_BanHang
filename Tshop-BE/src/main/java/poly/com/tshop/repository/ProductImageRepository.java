package poly.com.tshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import poly.com.tshop.domain.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}