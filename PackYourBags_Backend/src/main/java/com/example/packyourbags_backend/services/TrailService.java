package com.example.packyourbags_backend.services;

import com.example.packyourbags_backend.dtos.apiRequest.TrailApiResponse;
import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.TrailRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class TrailService {

    private final TrailRepository trailRepo;
    private final UserRepository userRepo;

    //Repositories for database info retrieval
    @Autowired
    private TrailRepository trailRepository;
    @Autowired
    private UserRepository userRepository;

    public TrailService(TrailRepository trailRepository, UserRepository userRepository) {
        this.trailRepo = trailRepository;
        this.userRepo = userRepository;
    }

    public Trail saveTrail(Integer userId, Trail trail) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Assign user to the trail
        trail.setUser(user);
        return trailRepo.save(trail);
    }

    public boolean checkUserMainTrail(Integer userId) {
        return trailRepository.existsByUserIdAndTrailType(userId, "Main");
    }
}

