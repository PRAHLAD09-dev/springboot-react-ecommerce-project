package com.prahlad.ecommerce.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;


    // ================= AI GENERATED =================

    @Column(columnDefinition = "TEXT")
    private String aiDescription;

    @Column(columnDefinition = "TEXT")
    private String specificationsJson;

    @Column(columnDefinition = "TEXT")
    private String featureHighlightsJson;

    @Column(columnDefinition = "TEXT")
    private String seoKeywords;

    // ================= BASIC =================

    private double price;
    
    private double mrp;

    private int stock;

    private boolean active = true;

    @ElementCollection
    @CollectionTable(
            name = "product_colors",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "color")
    @Builder.Default
    private List<String> colors = new ArrayList<>();
    
    // ================= MERCHANT =================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    // ================= CATEGORY =================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    // ================= IMAGES =================

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<ProductImage> images =
            new ArrayList<>();

    // ================= REVIEWS =================

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Review> reviews =
            new ArrayList<>();

    // ================= RATINGS =================

    public Double getAverageRating()
    {

        if (reviews == null || reviews.isEmpty())
        {
            return 0.0;
        }

        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public Integer getDiscountPercentage()
    {
        if (mrp <= 0 || mrp <= price)
        {
            return 0;
        }

        return (int) Math.round(
                ((mrp - price) / mrp) * 100
        );
    }
    
    public Integer getTotalReviews()
    {
        return reviews == null
                ? 0
                : reviews.size();
    }

    
    @OneToMany(
            mappedBy = "product"
    )
    private List<HeroBanner> heroBanners =
            new ArrayList<>();
}