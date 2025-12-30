package org.reservation.reservationterrain.service;

import java.util.List;

import org.reservation.reservationterrain.dto.OwnerCreateDTO;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.ComplexeRepository;
import org.reservation.reservationterrain.repository.OwnerRepository;

import org.springframework.stereotype.Service;

@Service

public class AdminService {
    private final OwnerRepository ownerRepository;
    private final ComplexeRepository complexeRepository;

    public AdminService(OwnerRepository ownerRepository, ComplexeRepository complexeRepository) {
        this.ownerRepository = ownerRepository;
        this.complexeRepository = complexeRepository;
    }

    public Owner createOwner(OwnerCreateDTO dto) {
        if (ownerRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        Owner owner = new Owner();
        owner.setEmail(dto.getEmail());
        owner.setNom(dto.getNom());
        owner.setPrenom(dto.getPrenom());
        owner.setNumTele(dto.getNumTele());
        owner.setNomComplexe(dto.getNomComplexe());
        owner.setRole("OWNER");

        Complexe complexe = new Complexe();
        complexe.setNom(dto.getNomComplexe());
        complexe.setVille(dto.getVille());
        complexe.setAdress(dto.getAdress());
        complexe.setOwner(owner);

        ownerRepository.save(owner);
        complexeRepository.save(complexe);

        return owner;
    }

    public List<Complexe> seeAllComplexe() {
        return complexeRepository.findAll();
    }
}
