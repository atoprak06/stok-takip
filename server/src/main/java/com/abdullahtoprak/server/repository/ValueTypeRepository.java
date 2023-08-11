package com.abdullahtoprak.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.ValueType;

public interface ValueTypeRepository extends JpaRepository<ValueType,Long> {
    
} 
