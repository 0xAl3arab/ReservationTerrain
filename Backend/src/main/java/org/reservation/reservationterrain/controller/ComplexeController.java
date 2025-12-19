package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ComplexeResponse;
import org.reservation.reservationterrain.service.ComplexeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin // si front séparé (React)
@RestController
@RequestMapping("/api/complexes")
public class ComplexeController {

    private final ComplexeService complexeService;

    public ComplexeController(ComplexeService complexeService) {
        this.complexeService = complexeService;
    }

    @GetMapping
    public List<ComplexeResponse> getAllComplexes() {
        return complexeService.getAllComplexes();
    }
}
