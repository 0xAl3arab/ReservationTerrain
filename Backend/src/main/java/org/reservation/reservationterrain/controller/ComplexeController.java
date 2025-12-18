package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ComplexeResponse;
import org.reservation.reservationterrain.service.ComplexeService;
import org.springframework.web.bind.annotation.*;
import org.reservation.reservationterrain.dto.TerrainResponseDTO;
import org.reservation.reservationterrain.service.TerrainService;
import java.util.List;

@CrossOrigin // si front séparé (React)
@RestController
@RequestMapping("/api/complexes")
public class ComplexeController {

    private final ComplexeService complexeService;
    private final TerrainService terrainService;

    public ComplexeController(ComplexeService complexeService, TerrainService terrainService) {
        this.complexeService = complexeService;
        this.terrainService = terrainService;
    }

    @GetMapping
    public List<ComplexeResponse> getAllComplexes() {
        return complexeService.getAllComplexes();
    }

    @GetMapping("/{id}")
    public ComplexeResponse getComplexeById(@PathVariable Long id) {
        return complexeService.getComplexeById(id);
    }

    @GetMapping("/{complexeId}/terrains")
    public List<TerrainResponseDTO> getTerrainsByComplexe(@PathVariable Long complexeId) {
        return terrainService.getTerrainsByComplexe(complexeId);
    }

}
