package com.abdullahtoprak.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.AttributeValue;

public interface AttributeValueRepository extends JpaRepository<AttributeValue,Long> {
    
}
