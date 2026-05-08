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

    public void generateTrainingPlan(Integer idTrail, LocalDate plannedDate) {

        // Load main trail from db
        Trail main = trailRepository.findById(idTrail).orElseThrow(() -> new RuntimeException("Trail not found"));
        // Load user from main trail
        User user = main.getUser();
        String county = user.getCounty();
        // Compute up to 3 weekends before the event
        List<LocalDate> weekends = computeUpcomingWeekends(plannedDate);

        // Select suitable training trails
        List<Trail> candidates = trailRepository.findByCounty(main.getCounty())
                .stream()
                // exclude main trail
                .filter(t -> !t.getId().equals(main.getId()))
                // must be shorter than main
                .filter(t -> t.getLengthKm() < main.getLengthKm())
                // sort by length
                .sorted(Comparator.comparing(Trail::getLengthKm))
                .toList();

        List<Trail> assigned = new ArrayList<>();
        System.out.println("CANDIDATES" + candidates);
        /*
        // Assign trails to weekends
        for (int i = 0; i < weekends.size() && i < candidates.size(); i++) {
            Trail training = cloneAsTraining(candidates.get(i), weekends.get(i), user.getId());
            TrailRepository.save(training);
        }

        // Mark main trail
        main.setActivity("Main");
        trailRepository.save(main);
         */
    }
    //Get the remaining weekends based on date to prepare trainings
    private List<LocalDate> computeUpcomingWeekends(LocalDate targetDate) {

        List<LocalDate> weekendsList = new ArrayList<>();
        LocalDate curDate = LocalDate.now();
        int maxDays = 3; //Maximum three training activities

        while (curDate.isBefore(targetDate) && weekendsList.size() < maxDays) {
            if (curDate.getDayOfWeek() == DayOfWeek.SATURDAY) {
                //Add one more day for training each saturday
                weekendsList.add(curDate);
            }
            //Add one to counter of days
            curDate = curDate.plusDays(1);
        }
        return weekendsList;
    }
}

