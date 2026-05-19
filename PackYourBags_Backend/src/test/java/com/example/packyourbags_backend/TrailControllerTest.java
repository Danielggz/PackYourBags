package com.example.packyourbags_backend;

import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.TrailRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TrailControllerIntegrationTest extends AbstractMysqlTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TrailRepository trailRepo;

    @BeforeEach
    void setup() {
        trailRepo.deleteAll();
        userRepo.deleteAll();

        User user = new User(
                "JD", "John", "Doe",
                "john@example.com", "m",
                "somewhere", 180, 75.0F, "pass123"
        );
        userRepo.save(user);
    }

    @Test
    void saveTrail_savesTrailForUser() throws Exception {
        User user = userRepo.findAll().get(0);

        // ⭐ Include idUser so Jackson does not reject the JSON
        String json = """
        {
            "idTrail": 1,
            "idUser": %d,
            "name": "Wicklow Way",
            "trailType": "Main",
            "lat": 0,
            "lon": 0
        }
        """.formatted(user.getId());

        mockMvc.perform(post("/api/trails/saveTrail")
                        .sessionAttr("userId", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Wicklow Way"));
    }

    @Test
    void saveTrainingTrails_savesMultiple() throws Exception {
        User user = userRepo.findAll().get(0);

        // ⭐ Include idUser + lat/lon to avoid Jackson errors
        String json = """
        [
            { "idTrail": 1, "idUser": %d, "name": "Trail A", "trailType": "Training", "lat": 0, "lon": 0 },
            { "idTrail": 2, "idUser": %d, "name": "Trail B", "trailType": "Training", "lat": 0, "lon": 0 }
        ]
        """.formatted(user.getId(), user.getId());

        mockMvc.perform(post("/api/trails/saveTrainingTrails")
                        .sessionAttr("userId", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Training trails saved"));
    }
}

