package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ComplexeResponse;
import org.reservation.reservationterrain.dto.TerrainResponse;
import org.reservation.reservationterrain.service.ComplexeService;
import org.reservation.reservationterrain.service.TerrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/complexes")
public class ComplexeController {

    private final ComplexeService complexeService;
    private final TerrainService terrainService; // On injecte le service des terrains

    public ComplexeController(ComplexeService complexeService, TerrainService terrainService) {
        this.complexeService = complexeService;
        this.terrainService = terrainService;
    }

    @GetMapping
    public List<ComplexeResponse> getAllComplexes() {
        return complexeService.getAllComplexes();
    }

    // --- NOUVEAU : Récupérer les terrains d'un complexe (Public) ---
    @GetMapping("/{id}/terrains")
    public ResponseEntity<List<TerrainResponse>> getTerrainsByComplexe(@PathVariable Long id) {
        return ResponseEntity.ok(terrainService.getTerrainsPublic(id));
    }
}