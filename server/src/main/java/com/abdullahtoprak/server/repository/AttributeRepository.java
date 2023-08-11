package com.abdullahtoprak.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.Attribute;


public interface AttributeRepository extends JpaRepository<Attribute,Long> {

    Optional<List<Attribute>> findAttributesBySubCategoriesId(Long id);  
    
} 
