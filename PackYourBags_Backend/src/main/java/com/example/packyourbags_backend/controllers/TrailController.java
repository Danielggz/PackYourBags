package com.example.packyourbags_backend.controllers;
import com.example.packyourbags_backend.dtos.GeneratePlanRequest;
import com.example.packyourbags_backend.dtos.apiRequest.TrailApiResponse;
import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.services.TrailApiService;
import com.example.packyourbags_backend.services.TrailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trails")
public class TrailController {

    //Get DTO for api data
    @Autowired
    private TrailApiService TrailApiService;

    private final TrailService trailService;

    public TrailController(TrailService trailService) {
        this.trailService = trailService;
    }

    @GetMapping("/allTrails")
    public TrailApiResponse getAllTrails() {
        return TrailApiService.fetchAllTrails();
    }

    @PostMapping("/saveTrail")
    public ResponseEntity<Trail> saveTrail(@RequestBody Trail trail, HttpSession session) {

        //Get session id
        Integer userId = (Integer) session.getAttribute("userId");
        if(userId == null) {
            throw new RuntimeException("User is not logged in");
        }
        Trail saved = trailService.saveTrail(userId, trail);
        if (saved == null) {
            return ResponseEntity.status(500).build(); // unexpected failure
        }
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/saveTrainingTrails")
    public ResponseEntity<?> saveTrainingTrails(@RequestBody List<Trail> trails, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }
        for (Trail t : trails) {
            trailService.saveTrail(userId, t);
        }
        return ResponseEntity.ok("Training trails saved");
    }


}
