package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.service.TerrainService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/terrains")
public class TerrainController {

    private final TerrainService terrainService;

    public TerrainController(TerrainService terrainService) {
        this.terrainService = terrainService;
    }

    @GetMapping("/active/count")
    public long countActiveTerrains() {
        return terrainService.countActiveTerrains();
    }

    @GetMapping("/active/total-count")
    public long countTotalActiveTerrains() {
        return terrainService.countActiveTerrains();
    }
}
