package com.abdullahtoprak.server.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.abdullahtoprak.server.models.Unit;
import com.abdullahtoprak.server.repository.UnitRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UnitService {
    private final UnitRepository unitRepository;

    public List<Unit> getAllUnits(){
        List<Unit> units = unitRepository.findAll();
        return units;
    }

}
