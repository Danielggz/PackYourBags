package com.example.packyourbags_backend.services;

import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.TrailRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TrailService {

    private final TrailRepository trailRepo;
    private final UserRepository userRepo;

    public TrailService(TrailRepository trailRepository, UserRepository userRepository) {
        this.trailRepo = trailRepository;
        this.userRepo = userRepository;
    }

    public Trail saveTrail(Integer userId, Trail trail) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        trail.setUser(user);
        return trailRepo.save(trail);
    }
}

