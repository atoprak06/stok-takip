package com.abdullahtoprak.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.SubCategory;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    Optional<List<SubCategory>> findByParentCategoryId(Long id);

}
