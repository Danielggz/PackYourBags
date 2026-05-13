package com.example.packyourbags_backend;

import com.example.packyourbags_backend.models.entities.Trail;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.TrailRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest
class TrailRepositoryTest extends AbstractMysqlTest {

    @Autowired
    private TrailRepository repo;

    @Autowired
    private UserRepository userRepo;

    @Test
    void saveAndFindTrail() {
        User user = new User("JD", "John", "Doe", "john@example.com", "m", "somewhere", 180, 75.0F, "pass123");
        userRepo.save(user);

        Trail trail = new Trail();
        trail.setUser(user);
        trail.setIdTrail(1);
        trail.setName("Wicklow Way");
        trail.setTrailType("Main");

        Trail saved = repo.save(trail);

        Trail found = repo.findById(saved.getId()).orElse(null);

        assertNotNull(found);
        assertEquals("Wicklow Way", found.getName());
    }

    @Test
    void findByUserIdAndTrailType_returnsCorrectTrail() {
        User user = new User("JD", "John", "Doe", "john@example.com", "m", "somewhere", 180, 75.0F, "pass123");
        userRepo.save(user);

        Trail trail = new Trail();
        trail.setUser(user);
        trail.setIdTrail(1);
        trail.setName("Main Trail");
        trail.setTrailType("Main");
        repo.save(trail);

        Optional<Trail> found = repo.findByUserIdAndTrailType(user.getId(), "Main");

        assertTrue(found.isPresent());
        assertEquals("Main Trail", found.get().getName());
    }
}

