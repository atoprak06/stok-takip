package com.abdullahtoprak.server.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.abdullahtoprak.server.models.Store;

public interface StoreRepository extends JpaRepository<Store, Long> {

}
