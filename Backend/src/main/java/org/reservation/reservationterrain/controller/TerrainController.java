package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.service.TerrainService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terrains")
@CrossOrigin(origins = "http://localhost:5173")
public class TerrainController {

    private final TerrainService terrainService;

    public TerrainController(TerrainService terrainService) {
        this.terrainService = terrainService;
    }

    @PostMapping
    public Terrain ajouter(@AuthenticationPrincipal Jwt jwt, @RequestBody Terrain terrain) {
        return terrainService.ajouterTerrain(jwt, terrain);
    }

    @GetMapping("/mes-terrains")
    public List<Terrain> lister(@AuthenticationPrincipal Jwt jwt) {
        return terrainService.getMesTerrains(jwt);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        terrainService.supprimerTerrain(id);
    }
}