package com.example.packyourbags_backend;

import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.TrailRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import com.example.packyourbags_backend.services.TrailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(MockitoExtension.class)
class TrailServiceTest {

    @Mock
    private TrailRepository trailRepo;

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private TrailService service;

    @Test
    void saveTrail_assignsUserAndSaves() {
        User user = new User();
        user.setId(1);

        Trail trail = new Trail();
        trail.setName("Wicklow Way");

        when(userRepo.findById(1)).thenReturn(Optional.of(user));
        when(trailRepo.save(trail)).thenReturn(trail);

        Trail result = service.saveTrail(1, trail);

        assertEquals(user, result.getUser());
        verify(trailRepo).save(trail);
    }

    @Test
    void getMainTrail_returnsTrail() {
        Trail trail = new Trail();
        when(trailRepo.findByUserIdAndTrailType(1, "Main"))
                .thenReturn(Optional.of(trail));

        Trail result = service.getMainTrail(1);

        assertEquals(trail, result);
    }

    @Test
    void getTrainingTrails_returnsList() {
        List<Trail> trails = Arrays.asList(new Trail(), new Trail());
        when(trailRepo.findAllByUserIdAndTrailType(1, "Training"))
                .thenReturn(trails);

        List<Trail> result = service.getTrainingTrails(1);

        assertEquals(2, result.size());
    }
}

