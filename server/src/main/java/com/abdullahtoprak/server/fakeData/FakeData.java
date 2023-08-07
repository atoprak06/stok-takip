package com.abdullahtoprak.server.fakeData;

import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.abdullahtoprak.server.models.Attribute;
import com.abdullahtoprak.server.models.AttributeValue;
import com.abdullahtoprak.server.models.ParentCategory;
import com.abdullahtoprak.server.models.Product;
import com.abdullahtoprak.server.models.Store;
import com.abdullahtoprak.server.models.SubCategory;
import com.abdullahtoprak.server.models.Unit;
import com.abdullahtoprak.server.models.User;
import com.abdullahtoprak.server.models.ValueType;
import com.abdullahtoprak.server.repository.AttributeRepository;
import com.abdullahtoprak.server.repository.AttributeValueRepository;
import com.abdullahtoprak.server.repository.ParentCategoryRepository;
import com.abdullahtoprak.server.repository.ProductRepository;
import com.abdullahtoprak.server.repository.StoreRepository;
import com.abdullahtoprak.server.repository.SubCategoryRepository;
import com.abdullahtoprak.server.repository.UnitRepository;
import com.abdullahtoprak.server.repository.UserRepository;
import com.abdullahtoprak.server.repository.ValueTypeRepository;
import com.github.javafaker.Faker;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class FakeData implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final ParentCategoryRepository parentCategoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final ValueTypeRepository valueTypeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }

    private void initializeData() {
        if (storeRepository.findAll().isEmpty()) {
            Faker faker = new Faker();
            Random random = new Random();

            ValueType type1 = ValueType.builder().name("String").build();
            ValueType type2 = ValueType.builder().name("Boolean").build();
            ValueType type3 = ValueType.builder().name("Number").build();

            type1 = valueTypeRepository.save(type1);
            type2 = valueTypeRepository.save(type2);
            type3 = valueTypeRepository.save(type3);

            ValueType[] types = { type1, type2, type3 };

            for (int u = 0; u <= 2; u++) {
                int randomIndex = random.nextInt(types.length);
                ValueType randomValueType = types[randomIndex];
                Attribute attribute = Attribute.builder()
                        .name(faker.name().firstName())
                        .valueType(randomValueType)
                        .build();
                attributeRepository.save(attribute);

            }

            List<Attribute> attributes = attributeRepository.findAll();

            for (int k = 0; k <= 4; k++) {
                Store store = Store.builder().name(faker.name().firstName()).build();
                Unit unit = Unit.builder().name(faker.name().title()).build();
                unitRepository.save(unit);
                storeRepository.save(store);
                for (int i = 0; i <= 1; i++) {
                    ParentCategory parentCategory = ParentCategory.builder().name(faker.commerce().department())
                            .build();
                    parentCategoryRepository.save(parentCategory);
                    for (int j = 0; j <= 4; j++) {
                        SubCategory subCategory = SubCategory.builder().name(faker.name().lastName())
                                .parentCategory(parentCategory).build();
                        subCategoryRepository.save(subCategory);

                        for (int t = 0; t <= 30; t++) {

                            Product product = Product.builder().name(faker.commerce().productName()).store(store)
                                    .subCategory(subCategory)
                                    .stock(faker.random().nextInt(1, 1000)).unit(unit).build();
                            productRepository.save(product);


                            for (int ı = 0; ı <= 2; ı++) {                                

                                if (ı == 0) {
                                    AttributeValue attributeValueOne = AttributeValue.builder()
                                            .booleanValue(random.nextBoolean())
                                            .attribute(attributes.get(ı)).build();
                                    attributeValueRepository.save(attributeValueOne);

                                } else if (ı == 1) {
                                    AttributeValue attributeValueTwo = AttributeValue.builder()
                                            .numberValue(faker.random().nextInt(1, 1000))
                                            .attribute(attributes.get(ı)).build();
                                    attributeValueRepository.save(attributeValueTwo);

                                } else if (ı == 2) {
                                    AttributeValue attributeValueThree = AttributeValue.builder()
                                            .stringValue(faker.name().firstName())
                                            .attribute(attributes.get(ı)).build();
                                    attributeValueRepository.save(attributeValueThree);

                                }
                            }                           

                           
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
