package com.example.packyourbags_backend.controllers;

import com.example.packyourbags_backend.models.entities.Equipment;
import com.example.packyourbags_backend.repositories.EquipmentRepository;
import com.example.packyourbags_backend.services.EquipmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getEquipment(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        return ResponseEntity.ok(service.getEquipment(userId));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveEquipment(@RequestBody List<Equipment> items, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        service.saveEquipment(userId, items);
        return ResponseEntity.ok("Equipment saved");
    }
}
