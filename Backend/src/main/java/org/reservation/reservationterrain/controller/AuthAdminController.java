package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.AdminLoginDTO;
import org.reservation.reservationterrain.dto.TokenResponse;
import org.reservation.reservationterrain.service.AdminLoginService;
import org.springframework.web.bind.annotation.*;

@RestController // ✅ CRITICAL: Add this
@RequestMapping("/admin")
public class AuthAdminController {

    private final AdminLoginService adminLoginService;

    public AuthAdminController(AdminLoginService adminLoginService) {
        this.adminLoginService = adminLoginService;
    }

    @PostMapping("/login") // ✅ This matches POST /admin/login
    public TokenResponse login(@RequestBody AdminLoginDTO adminLoginDTO) {
        return adminLoginService.login(adminLoginDTO);
    }
}
