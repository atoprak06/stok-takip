package com.abdullahtoprak.server.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.models.Attribute;
import com.abdullahtoprak.server.models.AttributeValue;
import com.abdullahtoprak.server.models.Product;
import com.abdullahtoprak.server.repository.AttributeRepository;
import com.abdullahtoprak.server.repository.AttributeValueRepository;
import com.abdullahtoprak.server.repository.ProductRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AttributeValueService {

    private final AttributeValueRepository attributeValueRepository;
    private final ProductRepository productRepository;
    private final AttributeRepository attributeRepository;

    public List<AttributeValue> findByProductId(Long id) {

        Optional<List<AttributeValue>> attributeValues = attributeValueRepository.findByProductId(id);

        if (attributeValues.isPresent()) {
            return attributeValues.get();
        }

        return null;

    }

    public void updateByProduct(Long id, Map<Long, Object> attrs) {

        Optional<List<AttributeValue>> attributeValues = attributeValueRepository.findByProductId(id);

        if (attributeValues.isPresent()) {
            List<AttributeValue> values = attributeValues.get();
            for (AttributeValue value : values) {
                Long attributeId = value.getAttribute().getId();
                String type = value.getAttribute().getValueType().getName();

                if (attrs.containsKey(attributeId)) {
                    if (type.equals("String")) {
                        value.setStringValue(attrs.get(attributeId).toString());
                    } else if (type.equals("Boolean")) {
                        if (attrs.get(attributeId).toString().equals("true")) {
                            value.setBooleanValue(true);

                        } else {
                            value.setBooleanValue(false);
                        }

                    } else if (type.equals("Number")) {

                        value.setNumberValue(Integer.parseInt(attrs.get(attributeId).toString()));
                    }

                    attributeValueRepository.save(value);
                    attrs.remove(attributeId);

                }

            }
            if (attrs.size() > 0) {
                Optional<Product> product = productRepository.findById(id);
                for (Long key : attrs.keySet()) {
                    Optional<Attribute> attribute = attributeRepository.findById(key);
                    AttributeValue newValue = AttributeValue.builder().product(product.get()).attribute(attribute.get())
                            .build();
                    String type = attribute.get().getValueType().getName();
                    if (type.equals("String")) {
                        newValue.setStringValue(attrs.get(key).toString());
                    } else if (type.equals("Boolean")) {
                        if (attrs.get(key).toString().equals("true")) {
                            newValue.setBooleanValue(true);

                        } else {
                            newValue.setBooleanValue(false);
                        }

                    } else if (type.equals("Number")) {

                        newValue.setNumberValue(Integer.parseInt(attrs.get(key).toString()));
                    }
                    attributeValueRepository.save(newValue);

                }

            }
        }

    }

    public void createAttributeValues(Long id, Map<Long, Object> attrs) {
        Optional<Product> product = productRepository.findById(id);

        for (Long key : attrs.keySet()) {
            Optional<Attribute> attribute = attributeRepository.findById(key);
            AttributeValue newValue = AttributeValue.builder().product(product.get()).attribute(attribute.get())
                    .build();
            String type = attribute.get().getValueType().getName();
            if (type.equals("String")) {
                newValue.setStringValue(attrs.get(key).toString());
            } else if (type.equals("Boolean")) {
                if (attrs.get(key).toString().equals("true")) {
                    newValue.setBooleanValue(true);

                } else {
                    newValue.setBooleanValue(false);
                }

            } else if (type.equals("Number")) {

                newValue.setNumberValue(Integer.parseInt(attrs.get(key).toString()));
            }
            attributeValueRepository.save(newValue);

        }

    }
}
