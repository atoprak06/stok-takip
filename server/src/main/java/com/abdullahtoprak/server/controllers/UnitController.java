package com.abdullahtoprak.server.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdullahtoprak.server.models.Unit;
import com.abdullahtoprak.server.services.UnitService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/unit")
public class UnitController {
    private final UnitService unitService;

    @GetMapping
    public ResponseEntity<List<Unit>> getAllUnits() {
        List<Unit> units = unitService.getAllUnits();
        return ResponseEntity.status(HttpStatus.OK).body(units);
    }

}
