package com.abdullahtoprak.server.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Entity
@Builder
@Table(name = "sub_category")
public class SubCategory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Category name can't be empty")
    @Size(min = 2, message = "{validation.name.size.too_short}")
    @Size(max = 200, message = "{validation.name.size.too_long}")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_category_id", nullable = true)
    private ParentCategory parentCategory;

    @OneToMany(mappedBy = "subCategory", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JsonIgnore
    private List<Product> products;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "sub_category_attribute", joinColumns = @JoinColumn(name = "sub_category_id"), inverseJoinColumns = @JoinColumn(name = "attribute_id"))
    @Builder.Default
    @JsonIgnore
    private List<Attribute> attributes = new ArrayList<>();

    public SubCategory() {
    }

    public SubCategory(Long id,
            @NotBlank(message = "Category name can't be empty") @Size(min = 2, message = "{validation.name.size.too_short}") @Size(max = 200, message = "{validation.name.size.too_long}") String name,
            ParentCategory parentCategory, List<Product> products, List<Attribute> attributes) {
        this.id = id;
        this.name = name;
        this.parentCategory = parentCategory;
        this.products = products;
        this.attributes = attributes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ParentCategory getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(ParentCategory parentCategory) {
        this.parentCategory = parentCategory;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public List<Attribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }

}
