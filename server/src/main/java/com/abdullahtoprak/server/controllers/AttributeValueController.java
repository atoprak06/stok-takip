package com.abdullahtoprak.server.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.models.AttributeValue;
import com.abdullahtoprak.server.services.AttributeValueService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/attribute-value")
@AllArgsConstructor
public class AttributeValueController {

    private final AttributeValueService attributeValueService;

    @GetMapping("/product/{id}")
    public ResponseEntity<List<AttributeValue>> getAttributeValueByProduct(@PathVariable Long id) {
        List<AttributeValue> attributeValues = attributeValueService.findByProductId(id);

        return ResponseEntity.status(HttpStatus.OK).body(attributeValues);
    }

}
