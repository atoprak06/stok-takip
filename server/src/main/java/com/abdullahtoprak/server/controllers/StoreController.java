package com.abdullahtoprak.server.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.dtos.StoreDto;
import com.abdullahtoprak.server.models.Store;
import com.abdullahtoprak.server.services.StoreService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/store")
@AllArgsConstructor
public class StoreController {
    private final StoreService storeService;

    /* create new store */
    @PostMapping
    public ResponseEntity<?> createStore(@Valid @ModelAttribute StoreDto storeDto) {
        Store newStore = storeService.createStore(storeDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newStore);
    }

    /* update store */
    @PatchMapping("/{id}")
    public ResponseEntity<Store> updateStore(@Valid @ModelAttribute StoreDto storeDto, @PathVariable Long id) {
        Store updatedStore = storeService.updateStore(storeDto, id);
        return ResponseEntity.status(HttpStatus.OK).body(updatedStore);
    }

    /* delete store */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStore(@PathVariable Long id){
        String message = storeService.deleteStore(id);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    /* get all stores */
    @GetMapping
    public ResponseEntity<List<Store>> getlAllStores(){
        List<Store> stores = storeService.getAllStores();
        return ResponseEntity.status(HttpStatus.OK).body(stores);
    }

}
