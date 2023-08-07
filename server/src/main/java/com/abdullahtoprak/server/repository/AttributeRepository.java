package com.abdullahtoprak.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.Attribute;

public interface AttributeRepository extends JpaRepository<Attribute,Long> {
    
}
