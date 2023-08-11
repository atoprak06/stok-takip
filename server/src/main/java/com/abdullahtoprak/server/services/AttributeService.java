package com.abdullahtoprak.server.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.models.Attribute;
import com.abdullahtoprak.server.repository.AttributeRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AttributeService {

    private final AttributeRepository attributeRepository;

    public List<Attribute> getAttributesByCategory(Long id) {
        Optional<List<Attribute>> attributes = attributeRepository.findAttributesBySubCategoriesId(id);
        if (attributes.isPresent()) {
            return attributes.get();
        }

        return null;

    }

}
