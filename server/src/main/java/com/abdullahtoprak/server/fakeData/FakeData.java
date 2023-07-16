package com.abdullahtoprak.server.fakeData;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.abdullahtoprak.server.models.ParentCategory;
import com.abdullahtoprak.server.models.Product;
import com.abdullahtoprak.server.models.Store;
import com.abdullahtoprak.server.models.SubCategory;
import com.abdullahtoprak.server.models.User;
import com.abdullahtoprak.server.repository.ParentCategoryRepository;
import com.abdullahtoprak.server.repository.ProductRepository;
import com.abdullahtoprak.server.repository.StoreRepository;
import com.abdullahtoprak.server.repository.SubCategoryRepository;
import com.abdullahtoprak.server.repository.UserRepository;
import com.github.javafaker.Faker;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class FakeData implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final ParentCategoryRepository parentCategoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }

    private void initializeData() {
        if (storeRepository.findAll().isEmpty()) {
            Faker faker = new Faker();
            for (int k = 0; k <= 1; k++) {
                Store store = Store.builder().name(faker.name().firstName()).build();
                storeRepository.save(store);
                for (int i = 0; i <= 1; i++) {
                    ParentCategory parentCategory = ParentCategory.builder().name(faker.commerce().department()).build();
                    parentCategoryRepository.save(parentCategory);
                    for (int j = 0; j <= 4; j++) {
                        SubCategory subCategory = SubCategory.builder().name(faker.name().lastName())
                                .parentCategory(parentCategory).build();
                        subCategoryRepository.save(subCategory);
                        for (int t = 0; t <= 30; t++) {
                            String unit = faker.random().nextBoolean() ? "piece" : "kg";
                            Product product = Product.builder().name(faker.commerce().productName()).store(store)
                                    .subCategory(subCategory)
                                    .stock(faker.random().nextInt(1, 1000)).unit(unit).build();
                            productRepository.save(product);
                        }
                    }
                }
            }

        }

        if (!userRepository.findByUsername("admin").isPresent()) {

            User user = User.builder().username("admin").password(passwordEncoder.encode("password")).roles("admin")
                    .build();
            userRepository.save(user);
        }

    }

}
