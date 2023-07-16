package com.abdullahtoprak.server.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.dtos.SubCategoryDto;
import com.abdullahtoprak.server.models.SubCategory;
import com.abdullahtoprak.server.models.ParentCategory;
import com.abdullahtoprak.server.repository.SubCategoryRepository;
import com.abdullahtoprak.server.repository.ParentCategoryRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final ParentCategoryRepository parentCategoryRepository;

    /* create sub category */
    public SubCategory createSubCategory(SubCategoryDto subCategoryDto) {

        ParentCategory parentCategory = parentCategoryRepository.findById(subCategoryDto.getParentCategory()).get();
        SubCategory newSubCategory = SubCategory.builder().name(subCategoryDto.getName()).parentCategory(parentCategory)
                .build();
        SubCategory savedSubCategory = subCategoryRepository.save(newSubCategory);
        return savedSubCategory;
    }

    /* update sub category */
    public SubCategory updateSubCategory(SubCategoryDto subCategoryDto, Long id) {
        ParentCategory parentCategory = parentCategoryRepository.findById(subCategoryDto.getParentCategory()).get();
        SubCategory subCategory = subCategoryRepository.findById(id).get();
        subCategory.setName(subCategoryDto.getName());
        subCategory.setParentCategory(parentCategory);
        SubCategory updatedSubCategory = subCategoryRepository.save(subCategory);
        return updatedSubCategory;
    }

    /* delete sub category */
    public String deleteSubCategory(Long id) {
        Optional<SubCategory> subCategory = subCategoryRepository.findById(id);
        if (subCategory.isPresent()) {
            subCategoryRepository.deleteById(id);
            return String.format("Sub category is deleted");
        }
        return String.format("There is no sub category with id of %s", id);
    }

    /* get sub cat. by parent cat. */
    public List<SubCategory> getSubCategoryByParentCategory(Long id) {
        Optional<List<SubCategory>> subCategories = subCategoryRepository.findByParentCategoryId(id);
        if (subCategories.isPresent()) {
            return subCategories.get();
        }
        return null;
    }

    /* get sub cat by id */
    public SubCategory getSubCategoryById(Long id) {

        Optional<SubCategory> subCategory = subCategoryRepository.findById(id);
        if (subCategory.isPresent()) {
            return subCategory.get();
        }
        return null;

    }

    /* get sub cat. by parent cat. with null */
    public List<SubCategory> getSubCategoryByParentCategoryIsNull() {
        List<SubCategory> subCategories = subCategoryRepository.findAll();
        List<SubCategory> subCategoriesWithNullParent = subCategories.stream()
                .filter(subCategory -> subCategory.getParentCategory() == null).collect(Collectors.toList());
        return subCategoriesWithNullParent;
    }

}
