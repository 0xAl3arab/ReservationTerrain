package org.reservation.reservationterrain.controller;

import java.util.List;

import org.reservation.reservationterrain.dto.OwnerCreateDTO;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.service.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/addComplexe")
    public void addComplexe(@RequestBody OwnerCreateDTO ownerCreateDTO,
            org.springframework.security.core.Authentication authentication) {
        System.out.println(
                "Add Complexe request by: " + (authentication != null ? authentication.getName() : "anonymous"));
        System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "none"));
        adminService.createOwner(ownerCreateDTO);
    }

    @GetMapping("/seeAllComplexe")
    public List<Complexe> seeAllComplexe(org.springframework.security.core.Authentication authentication) {
        System.out.println(
                "See All Complexe request by: " + (authentication != null ? authentication.getName() : "anonymous"));
        System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "none"));
        return adminService.seeAllComplexe();
    }

}
