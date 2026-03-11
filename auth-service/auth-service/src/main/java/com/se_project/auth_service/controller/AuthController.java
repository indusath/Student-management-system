package com.se_project.auth_service.controller;

import com.se_project.auth_service.dto.*;
import com.se_project.auth_service.entity.AdminUser;
import com.se_project.auth_service.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    @Autowired
    private  AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AdminUser> registerAdmin( @RequestBody RegisterAdminRequest request) {
        log.info("API: Registering new admin");
        AdminUser admin = authService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(admin);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("API: Login request");
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @RequestHeader("Admin-Email") String adminEmail,
            HttpServletRequest request) {
        log.info("API: Logout request for {}", adminEmail);
        authService.logout(adminEmail, request.getRemoteAddr());
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }

    @PostMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validateToken(@RequestBody TokenValidationRequest request) {
        log.info("API: Token validation request");

        boolean isValid = authService.validateToken(request.getToken());

        if (isValid) {
            String email = authService.extractEmail(request.getToken());
            String role = authService.extractRole(request.getToken());

            return ResponseEntity.ok(new TokenValidationResponse(true, email, role));
        }

        return ResponseEntity.ok(new TokenValidationResponse(false, null, null));
    }




}
