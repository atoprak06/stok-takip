package com.abdullahtoprak.server.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.dtos.ProductDto;
import com.abdullahtoprak.server.models.Product;
import com.abdullahtoprak.server.models.Store;
import com.abdullahtoprak.server.models.SubCategory;
import com.abdullahtoprak.server.models.Unit;
import com.abdullahtoprak.server.repository.ProductRepository;
import com.abdullahtoprak.server.repository.StoreRepository;
import com.abdullahtoprak.server.repository.SubCategoryRepository;
import com.abdullahtoprak.server.repository.UnitRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final AttributeValueService attributeValueService;
    private final UnitRepository unitRepository;

    /* create product */
    public Product createProduct(ProductDto productDto) {
        Store store = storeRepository.findById(productDto.getStore()).get();
        SubCategory subCategory = subCategoryRepository.findById(productDto.getSubCategory()).get();
        Unit unit = unitRepository.findById(productDto.getUnit()).get();
        Product newProduct = Product.builder().name(productDto.getName()).stock(productDto.getStock()).store(store)
                .subCategory(subCategory).unit(unit).build();
        Product savedProduct = productRepository.saveAndFlush(newProduct);

        attributeValueService.createAttributeValues(savedProduct.getId(), productDto.getAttributes());

        return savedProduct;
    }

    /* get product by id */
    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return product.get();
        }
        return null;
    }

    /* update product */
    public Product updateProduct(ProductDto productDto, Long id) {
        Product product = productRepository.findById(id).get();
        product.setName(productDto.getName());
        product.setStock(productDto.getStock());
        Store store = storeRepository.findById(productDto.getStore()).get();
        product.setStore(store);
        SubCategory subCategory = subCategoryRepository.findById(productDto.getSubCategory()).get();
        Optional<Unit> unit = unitRepository.findById(productDto.getUnit());
        product.setSubCategory(subCategory);
        product.setUnit(unit.get());
        Product updatedProduct = productRepository.save(product);
        attributeValueService.updateByProduct(id, productDto.getAttributes());
        return updatedProduct;
    }

    /* delete product */
    public String deleteProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.deleteById(id);
            return "Product is deleted successfully";
        }
        return String.format("There is no product with id of %s", id);
    }

    /* find products by store id with pagination */
    public Map<String, Object> findByStore(Long storeId, Pageable pageable) {
        Page<Product> paginatedProducts = productRepository.findByStoreId(storeId, pageable);
        List<Product> products = paginatedProducts.getContent();
        Map<String, Object> paginatedProductsMap = new HashMap<>();
        paginatedProductsMap.put("count", paginatedProducts.getTotalElements());
        paginatedProductsMap.put("products", products);
        return paginatedProductsMap;
    }

}
