package com.abdullahtoprak.server.controllers;

import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.dtos.ProductDto;
import com.abdullahtoprak.server.models.Product;
import com.abdullahtoprak.server.services.ProductService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/products")
@AllArgsConstructor
public class ProductController {
    private final ProductService productService;

    /* create product */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @ModelAttribute ProductDto productDto) {
        Product product = productService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);

    }

    /* get prod by Id */
    @GetMapping("/{id}")
     public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }


    /* update product */
    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@Valid @ModelAttribute ProductDto productDto, @PathVariable Long id) {
        Product updatedProduct = productService.updateProduct(productDto, id);
        return ResponseEntity.status(HttpStatus.OK).body(updatedProduct);
    }

    /* delete product */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        String message = productService.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    /* find by store id with pagination */
    @GetMapping("/store/{storeId}")
    public ResponseEntity<Map<String,Object>> findByStore(@PathVariable Long storeId,
            @RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 15);
        Map<String,Object> productsByStoreMap = productService.findByStore(storeId,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(productsByStoreMap);
    }

}
