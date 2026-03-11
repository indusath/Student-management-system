package com.se_project.audit_service.controller;

import com.se_project.audit_service.dto.AuditLogRequest;
import com.se_project.audit_service.entity.AuditLog;
import com.se_project.audit_service.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@Slf4j
public class AuditController {

    @Autowired
    private  AuditService auditService;

    @PostMapping("/log")
    public ResponseEntity<AuditLog> logAction(@RequestBody AuditLogRequest request) {
        log.info("Received audit log request: {}", request.getAction());
        AuditLog saved = auditService.logAction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/admin/{adminEmail}")
    public ResponseEntity<List<AuditLog>> getLogsByAdmin(@PathVariable String adminEmail) {
        List<AuditLog> logs = auditService.getLogsByAdmin(adminEmail);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/target/{targetEntity}/{targetId}")
    public ResponseEntity<List<AuditLog>> getLogsByTarget(
            @PathVariable String targetEntity,
            @PathVariable String targetId) {
        List<AuditLog> logs = auditService.getLogsByTarget(targetEntity, targetId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        List<AuditLog> logs = auditService.getAllLogs();
        return ResponseEntity.ok(logs);
    }
}