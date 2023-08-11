package com.abdullahtoprak.server.models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;

@Builder
@Entity
@Table(name = "attribute_value")
public class AttributeValue {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "attribute_id", nullable = true)
    private Attribute attribute;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = true)
    private Product product;

    private Number numberValue;
    private Boolean booleanValue;
    private String stringValue;

    public AttributeValue() {

    }

    public AttributeValue(Long id, Attribute attribute, Product product, Number numberValue, Boolean booleanValue,
            String stringValue) {
        this.id = id;
        this.attribute = attribute;
        this.product = product;
        this.numberValue = numberValue;
        this.booleanValue = booleanValue;
        this.stringValue = stringValue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Attribute getAttribute() {
        return attribute;
    }

    public void setAttribute(Attribute attribute) {
        this.attribute = attribute;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Number getNumberValue() {
        return numberValue;
    }

    public void setNumberValue(Number numberValue) {
        this.numberValue = numberValue;
    }

    public Boolean getBooleanValue() {
        return booleanValue;
    }

    public void setBooleanValue(Boolean booleanValue) {
        this.booleanValue = booleanValue;
    }

    public String getStringValue() {
        return stringValue;
    }

    public void setStringValue(String stringValue) {
        this.stringValue = stringValue;
    }

}
