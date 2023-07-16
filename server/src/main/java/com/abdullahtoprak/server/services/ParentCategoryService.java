package com.abdullahtoprak.server.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.abdullahtoprak.server.dtos.ParentCategoryDto;
import com.abdullahtoprak.server.models.ParentCategory;
import com.abdullahtoprak.server.repository.ParentCategoryRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ParentCategoryService {

    private final ParentCategoryRepository parentCategoryRepository;

    /* get all parent categories */
    public List<ParentCategory> getAllParentCategories(){
        List<ParentCategory> allParentCategories = parentCategoryRepository.findAll();
        return allParentCategories;
    }

    /* create parent category */
    public ParentCategory createParentCategory(ParentCategoryDto parentCategoryDto) {
        ParentCategory newParentCategory = ParentCategory.builder().name(parentCategoryDto.getName()).build();
        ParentCategory savedParentCategory = parentCategoryRepository.save(newParentCategory);
        return savedParentCategory;
    }

    /* update existing parent category */
    public ParentCategory updatedParentCategory(ParentCategoryDto parentCategoryDto, Long id) {
        ParentCategory parentCategory = parentCategoryRepository.findById(id).get();
        parentCategory.setName(parentCategoryDto.getName());
        ParentCategory updatedParentCategory = parentCategoryRepository.save(parentCategory);
        return updatedParentCategory;
    }

    /* delete parent category by id */
    public String deleteParentCategory(Long id){
        Optional<ParentCategory> parentCategory = parentCategoryRepository.findById(id);
        if(parentCategory.isPresent()){
            parentCategoryRepository.deleteById(id);
            return String.format("Parent category is deleted");
        }
        return String.format("There is no parent category with id of %s",id);
    }

}
