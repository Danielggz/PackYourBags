package com.example.packyourbags_backend.controllers;
import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.services.TrailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trails")
public class TrailController {
    private final TrailService trailService;

    public TrailController(TrailService trailService) {
        this.trailService = trailService;
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
}
