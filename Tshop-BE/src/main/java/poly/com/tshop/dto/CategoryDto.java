package poly.com.tshop.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.Value;
import org.aspectj.bridge.IMessage;
import poly.com.tshop.domain.CategoryStatus;

import java.io.Serializable;

/**
 * DTO for {@link poly.com.tshop.domain.Category}
 */
@Data
public class CategoryDto implements Serializable {
    private Long id;

    @NotEmpty(message = "Category name is required")
    private String name;

    private CategoryStatus status;
}