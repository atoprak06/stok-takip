package com.abdullahtoprak.server.models;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Builder;

@Entity
@Builder
@Table(name = "attribute")
public class Attribute implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "value_type_id", nullable = true)
    private ValueType valueType;

    @ManyToMany(mappedBy = "attributes")
    @JsonIgnore
    private List<SubCategory> subCategories;

    @OneToMany(mappedBy = "attribute")
    @JsonIgnore
    private List<AttributeValue> attributeValues;

    public Attribute() {

    }

    public Attribute(Long id, String name, ValueType valueType, List<SubCategory> subCategories,
            List<AttributeValue> attributeValues) {
        this.id = id;
        this.name = name;
        this.valueType = valueType;
        this.subCategories = subCategories;
        this.attributeValues = attributeValues;
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

    public ValueType getValueType() {
        return valueType;
    }

    public void setValueType(ValueType valueType) {
        this.valueType = valueType;
    }

    public List<SubCategory> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<SubCategory> subCategories) {
        this.subCategories = subCategories;
    }

    public List<AttributeValue> getAttributeValues() {
        return attributeValues;
    }

    public void setAttributeValues(List<AttributeValue> attributeValues) {
        this.attributeValues = attributeValues;
    }

}
