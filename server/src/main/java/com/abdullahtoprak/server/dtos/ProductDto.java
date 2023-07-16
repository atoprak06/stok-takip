package com.abdullahtoprak.server.dtos;

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
    private String unit;

    
}
