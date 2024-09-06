package poly.com.tshop.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "category")
public class Category extends AbstractEntity{
  @Column(name = "name", nullable = false, length = 100)
  private String name;

  private CategoryStatus status;

}