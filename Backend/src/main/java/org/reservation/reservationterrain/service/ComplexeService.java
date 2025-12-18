package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.ComplexeResponse;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.repository.ComplexeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplexeService {

    private final ComplexeRepository complexeRepository;

    public ComplexeService(ComplexeRepository complexeRepository) {
        this.complexeRepository = complexeRepository;
    }

    public List<ComplexeResponse> getAllComplexes() {
        List<Complexe> complexes = complexeRepository.findAll();

        return complexes.stream()
                .map(c -> {
                    ComplexeResponse dto = new ComplexeResponse();
                    dto.setId(c.getId());
                    dto.setNom(c.getNom());
                    dto.setVille(c.getVille());
                    dto.setAdress(c.getAdress());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ComplexeResponse getComplexeById(Long id) {
        Complexe complexe = complexeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complexe non trouvé avec l'ID: " + id));

        ComplexeResponse dto = new ComplexeResponse();
        dto.setId(complexe.getId());
        dto.setNom(complexe.getNom());
        dto.setVille(complexe.getVille());
        dto.setAdress(complexe.getAdress());
        return dto;
    }
}
