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
    public Trail saveTrail(@RequestBody Trail trail, HttpSession session) {

        //Get session id
        Integer userId = (Integer) session.getAttribute("userId");
        if(userId == null) {
            throw new RuntimeException("User is not logged in");
        }

        return trailService.saveTrail(userId, trail);
    }

    @PostMapping("/generatePlan")
    public ResponseEntity<?> generatePlan(@RequestBody GeneratePlanRequest req) {
        trailService.generateTrainingPlan(req.getTrailId(), req.getPlannedDate());
        return ResponseEntity.ok().build();
    }
}
