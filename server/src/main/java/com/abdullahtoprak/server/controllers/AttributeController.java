package com.abdullahtoprak.server.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.models.Attribute;
import com.abdullahtoprak.server.services.AttributeService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/attributes")
@AllArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;

    @GetMapping(path = "/category/{id}")
    public ResponseEntity<List<Attribute>> getAttributesByCategory(@PathVariable Long id){
        List<Attribute> attributes = attributeService.getAttributesByCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body(attributes);
    }
    
}
