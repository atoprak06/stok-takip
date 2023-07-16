package com.abdullahtoprak.server.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.dtos.ParentCategoryDto;

import com.abdullahtoprak.server.models.ParentCategory;

import com.abdullahtoprak.server.services.ParentCategoryService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/parent-category")
@AllArgsConstructor
public class ParentCategoryController {
    private final ParentCategoryService parentCategoryService;

    /* create new parent category */
    @PostMapping
    public ResponseEntity<ParentCategory> createParentCategory(
            @Valid @ModelAttribute ParentCategoryDto parentCategoryDto) {
        ParentCategory newParentCategory = parentCategoryService.createParentCategory(parentCategoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newParentCategory);
    }

    /* update existing category */
    @PatchMapping("/{id}")
    public ResponseEntity<ParentCategory> updateParentCategory(
            @Valid @ModelAttribute ParentCategoryDto parentCategoryDto, @PathVariable Long id) {
                ParentCategory updatedParentCategory = parentCategoryService.updatedParentCategory(parentCategoryDto,id);
                return ResponseEntity.status(HttpStatus.OK).body(updatedParentCategory);
    }

    /* get all parent categories */
    @GetMapping
    public ResponseEntity<List<ParentCategory>> getParentCategories(){
        List<ParentCategory> allParentCategories = parentCategoryService.getAllParentCategories();
        return ResponseEntity.status(HttpStatus.OK).body(allParentCategories);
    }

    /* delete parent category */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteParentCategory(@PathVariable Long id){
        String message = parentCategoryService.deleteParentCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

}
