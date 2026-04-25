package com.syllabixtract.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/public/health")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("Public endpoint - no auth needed");
    }

    @GetMapping("/private/test")
    public ResponseEntity<String> privateEndpoint() {
        return ResponseEntity.ok("Private endpoint - auth works!");
    }
}