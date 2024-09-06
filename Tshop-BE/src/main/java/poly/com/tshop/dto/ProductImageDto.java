package poly.com.tshop.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link poly.com.tshop.domain.ProductImage}
 */
@Data
public class ProductImageDto implements Serializable {
    private Long id;
    private String uid;
    private String name;
    private String filename;
    private String url;
    private  String Status;

    private String response = "{\"status\":\"success\"}";

}