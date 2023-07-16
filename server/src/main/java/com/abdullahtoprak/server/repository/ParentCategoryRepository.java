package com.abdullahtoprak.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.abdullahtoprak.server.models.ParentCategory;

public interface ParentCategoryRepository extends JpaRepository<ParentCategory, Long> {

}
