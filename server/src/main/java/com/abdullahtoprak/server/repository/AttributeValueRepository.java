package com.abdullahtoprak.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.AttributeValue;

public interface AttributeValueRepository extends JpaRepository<AttributeValue,Long> {

    Optional<List<AttributeValue>> findByProductId(Long id);
    
} 
