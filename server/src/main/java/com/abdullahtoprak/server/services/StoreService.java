package com.abdullahtoprak.server.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.dtos.StoreDto;
import com.abdullahtoprak.server.models.Store;
import com.abdullahtoprak.server.repository.StoreRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    /* create store */
    public Store createStore(StoreDto storeDto) {
        Store newStore = Store.builder().name(storeDto.getName()).build();
        Store savedStore = storeRepository.save(newStore);
        return savedStore;
    }

    /* update store */
    public Store updateStore(StoreDto storeDto, Long id) {
        Store store = storeRepository.findById(id).get();
        store.setName(storeDto.getName());
        Store updatedStore = storeRepository.save(store);
        return updatedStore;
    }

    /* delete store */
    public String deleteStore(Long id) {
        Optional<Store> store = storeRepository.findById(id);
        if (store.isPresent()) {
            storeRepository.deleteById(id);
            return "Store is deleted successfully";
        }
        return String.format("There is no store with id of %s", id);
    }

    /* get all stores */
    public List<Store> getAllStores(){
        List<Store> stores = storeRepository.findAll();
        return stores;
    }

}
