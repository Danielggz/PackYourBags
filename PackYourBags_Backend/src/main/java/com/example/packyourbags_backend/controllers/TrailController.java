package com.example.packyourbags_backend.controllers;
import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.services.TrailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trails")
public class TrailController {
    private final TrailService trailService;

    public TrailController(TrailService trailService) {
        this.trailService = trailService;
    }

    @PostMapping("/{userId}")
    public Trail saveTrail(@PathVariable Integer userId, @RequestBody Trail trail) {
        return trailService.saveTrail(userId, trail);
    }
}
