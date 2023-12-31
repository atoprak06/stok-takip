package com.abdullahtoprak.server.dtos;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private String name;
    private Long store;
    private Long subCategory;
    private int stock;
    private Long unit;
    private Map<Long, Object> attributes;

}
