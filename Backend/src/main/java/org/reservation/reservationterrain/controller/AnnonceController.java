package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.AnnonceDTO;
import org.reservation.reservationterrain.service.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/annonces")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @PostMapping
    public ResponseEntity<AnnonceDTO> createAnnonce(@RequestBody AnnonceDTO dto) {
        return ResponseEntity.ok(annonceService.createAnnonce(dto));
    }

    @GetMapping
    public ResponseEntity<List<AnnonceDTO>> getAllAnnonces(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long terrainId) {
        
        if (city != null && !city.isEmpty()) {
            return ResponseEntity.ok(annonceService.getAnnoncesByCity(city));
        }
        
        if (terrainId != null) {
            return ResponseEntity.ok(annonceService.getAnnoncesByTerrain(terrainId));
        }

        return ResponseEntity.ok(annonceService.getAllAnnonces());
    }
}
