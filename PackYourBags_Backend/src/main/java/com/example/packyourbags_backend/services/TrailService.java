package com.example.packyourbags_backend.services;

import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.TrailRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrailService {

    private final TrailRepository trailRepository;
    private final UserRepository userRepository;

    // Constructor injection (clean + testable)
    public TrailService(TrailRepository trailRepository, UserRepository userRepository) {
        this.trailRepository = trailRepository;
        this.userRepository = userRepository;
    }

    public Trail saveTrail(Integer userId, Trail trail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        trail.setUser(user);
        return trailRepository.save(trail);
    }

    public Trail getMainTrail(Integer userId) {
        return trailRepository.findByUserIdAndTrailType(userId, "Main").orElse(null);
    }

    public List<Trail> getTrainingTrails(Integer userId) {
        return trailRepository.findAllByUserIdAndTrailType(userId, "Training");
    }

    public List<Trail> getAllTrails(Integer userId) {
        return trailRepository.findAllByUserId(userId);
    }

    public boolean checkUserMainTrail(Integer userId) {
        return trailRepository.existsByUserIdAndTrailType(userId, "Main");
    }
}
