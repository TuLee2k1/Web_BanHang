package poly.com.tshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import poly.com.tshop.domain.ProductStatus;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * DTO for {@link poly.com.tshop.domain.Product}
 */
@Data
public class ProductBriefDto implements Serializable {
    private Long id;

    private String name;

    private Integer quantity;

    private Double price;

    private Float discount;

    private Long viewCount;
    private Boolean isFeatured;
    private String brief;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date manufactureDate;
    private ProductStatus status;

    private String categoryName;

    private String imageFileName;




}