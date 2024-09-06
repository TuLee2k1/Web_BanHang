package poly.com.tshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.Value;
import poly.com.tshop.domain.ProductStatus;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * DTO for {@link poly.com.tshop.domain.Product}
 */
@Data
public class ProductDto implements Serializable {
    private Long id;
    @NotEmpty(message = "Name is required")
    private String name;
    @Min(value = 0)
    private Integer quantity;
    @Min(value = 0)
    private Double price;
    @Max(value = 100)
    private Float discount;

    private Long viewCount;
    private Boolean isFeatured;
    private String brief;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date manufactureDate;
    private ProductStatus status;

    private Long categoryId;

    private List<ProductImageDto> images;

    private ProductImageDto image;

    private CategoryDto category;

}