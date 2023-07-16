package com.abdullahtoprak.server.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByStoreId(Long id, Pageable pageable);

}
