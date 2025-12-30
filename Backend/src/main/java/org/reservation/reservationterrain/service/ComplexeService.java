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
    private final org.reservation.reservationterrain.repository.OwnerRepository ownerRepository;

    public ComplexeService(ComplexeRepository complexeRepository,
            org.reservation.reservationterrain.repository.OwnerRepository ownerRepository) {
        this.complexeRepository = complexeRepository;
        this.ownerRepository = ownerRepository;
    }

    public List<ComplexeResponse> getAllComplexes() {
        List<Complexe> complexes = complexeRepository.findAll();

        return complexes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ComplexeResponse getComplexeById(Long id) {
        Complexe complexe = complexeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complexe non trouvé avec l'ID: " + id));
        return mapToResponse(complexe);
    }

    public ComplexeResponse createComplexe(org.reservation.reservationterrain.dto.ComplexeRequest request) {
        Complexe complexe = new Complexe();
        complexe.setNom(request.getNom());
        complexe.setVille(request.getVille());
        complexe.setAdress(request.getAdress());

        if (request.getOwnerId() != null) {
            org.reservation.reservationterrain.model.Owner owner = ownerRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new IllegalArgumentException("Owner non trouvé"));
            complexe.setOwner(owner);
        }

        Complexe saved = complexeRepository.save(complexe);
        return mapToResponse(saved);
    }

    public ComplexeResponse updateComplexe(Long id, org.reservation.reservationterrain.dto.ComplexeRequest request) {
        Complexe complexe = complexeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complexe non trouvé"));

        complexe.setNom(request.getNom());
        complexe.setVille(request.getVille());
        complexe.setAdress(request.getAdress());

        if (request.getOwnerId() != null) {
            org.reservation.reservationterrain.model.Owner owner = ownerRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new IllegalArgumentException("Owner non trouvé"));
            complexe.setOwner(owner);
        }

        Complexe updated = complexeRepository.save(complexe);
        return mapToResponse(updated);
    }

    public void deleteComplexe(Long id) {
        if (!complexeRepository.existsById(id)) {
            throw new IllegalArgumentException("Complexe non trouvé");
        }
        complexeRepository.deleteById(id);
    }

    private ComplexeResponse mapToResponse(Complexe c) {
        ComplexeResponse dto = new ComplexeResponse();
        dto.setId(c.getId());
        dto.setNom(c.getNom());
        dto.setVille(c.getVille());
        dto.setAdress(c.getAdress());

        if (c.getOwner() != null) {
            ComplexeResponse.OwnerSummary ownerSummary = new ComplexeResponse.OwnerSummary();
            ownerSummary.setId(c.getOwner().getId());
            ownerSummary.setNom(c.getOwner().getNom());
            ownerSummary.setPrenom(c.getOwner().getPrenom());
            ownerSummary.setEmail(c.getOwner().getEmail());
            ownerSummary.setNumTele(c.getOwner().getNumTele());
            dto.setOwner(ownerSummary);
        }
        return dto;
    }
}
