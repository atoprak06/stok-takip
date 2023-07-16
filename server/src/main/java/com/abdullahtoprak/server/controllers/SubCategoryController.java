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

import com.abdullahtoprak.server.dtos.SubCategoryDto;
import com.abdullahtoprak.server.models.SubCategory;
import com.abdullahtoprak.server.services.SubCategoryService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/sub-category")
@AllArgsConstructor
public class SubCategoryController {
    private final SubCategoryService subCategoryService;

    /* create new sub category */
    @PostMapping
    public ResponseEntity<SubCategory> createSubCategory(@Valid @ModelAttribute SubCategoryDto subCategoryDto) {
        SubCategory newSubCategory = subCategoryService.createSubCategory(subCategoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSubCategory);
    }

    /* update existing sub category */
    @PatchMapping("/{id}")
    public ResponseEntity<SubCategory> updateSubCategory(@Valid @ModelAttribute SubCategoryDto subCategoryDto,
            @PathVariable Long id) {
        SubCategory updatedSubCategory = subCategoryService.updateSubCategory(subCategoryDto, id);
        return ResponseEntity.status(HttpStatus.OK).body(updatedSubCategory);
    }

    /* delete sub category */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubCategory(@PathVariable Long id) {
        String message = subCategoryService.deleteSubCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    /* get sub cat. by parent cat. */
    @GetMapping("/parent-category/{id}")
    public ResponseEntity<List<SubCategory>> getSubCategoryByParentCategory(@PathVariable Long id) {

        List<SubCategory> subCategories = subCategoryService.getSubCategoryByParentCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body(subCategories);

    }

    /* get sub cat by id */
    @GetMapping("/{id}")
    public ResponseEntity<SubCategory> getSubCategoryById(@PathVariable Long id) {

        SubCategory subCategory = subCategoryService.getSubCategoryById(id);
        return ResponseEntity.status(HttpStatus.OK).body(subCategory);
    }

    /* get all sub cat. which parent cat. is null */
    @GetMapping("/null-parent-categories")
    public ResponseEntity<List<SubCategory>> getSubCategoryByParentCategoryIsNull() {

        List<SubCategory> subCategories = subCategoryService.getSubCategoryByParentCategoryIsNull();
        return ResponseEntity.status(HttpStatus.OK).body(subCategories);

    }

}
