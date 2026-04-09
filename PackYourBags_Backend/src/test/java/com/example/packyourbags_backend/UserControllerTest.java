package com.example.packyourbags_backend;

import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerIntegrationTest extends AbstractMysqlTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository repo;

    @BeforeEach
    void setup() {
        repo.deleteAll();
        repo.save(new User("JD", "John", "Doe", "john@example.com", "m", 180, 75.0F, "pass123"));
    }

    @Test
    void getUsers_returnsList() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andDo(print());
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John"));
    }

    @Test
    void createUser_createsUser() throws Exception {
        String json = """
        {
            "username": "asmith",
            "name": "Alice",
            "lastName": "Smith",
            "email": "alice@example.com",
            "gender": "f",
            "height": 165,
            "weight": 60.0,
            "password": "pass123"
        }
        """;

        mockMvc.perform(post("/api/users/createUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice"));
    }

    @Test
    void getUser_returnsUser() throws Exception {
        User user = repo.findAll().get(0);

        mockMvc.perform(get("/api/users/" + user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John"));
    }

    @Test
    void deleteUser_deletesUser() throws Exception {
        User user = repo.findAll().get(0);

        mockMvc.perform(delete("/api/users/" + user.getId()))
                .andExpect(status().isOk());

        assertTrue(repo.findAll().isEmpty());
    }
}
