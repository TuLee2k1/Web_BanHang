package poly.com.tshop.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product")
public class Product extends AbstractEntity{
  @NotNull(message = "Name is required")
  @Column(name = "name")
  private String name;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "price")
  private Double price;

  @Column(name = "discount")
  private Float discount;

  @Column(name = "view_count")
  private Long viewCount;

  @Column(name = "is_featured")
  private Boolean isFeatured;

  @Temporal(TemporalType.DATE)
  @Column(name = "create_date")
  private Date createDate;

  @Temporal(TemporalType.DATE)
  @Column(name = "update_date")
  private Date updateDate;

  @Column(name = "brief")
  private String brief;

  @Column(name = "description", length = 2000)
  private String description;

  @Temporal(TemporalType.DATE)
  @Column(name = "manufacture_date")
  private Date manufactureDate;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

  @ManyToMany
  @JoinTable(name = "product_productImages",
          joinColumns = @JoinColumn(name = "product_id"),
          inverseJoinColumns = @JoinColumn(name = "productImages_id"))
  private Set<ProductImage> Images = new LinkedHashSet<>();

  @OneToOne(orphanRemoval = true)
  @JoinColumn(name = "product_image_id")
  private ProductImage Image;

  @Column(name = "status")
  private ProductStatus status;

  @PrePersist
  public void prePersist() {
  createDate = new Date();

  if(isFeatured == null) isFeatured = false;
  viewCount =0L;
  }

  @PreUpdate
  public void preUpdate() {
  updateDate = new Date();
  }
}