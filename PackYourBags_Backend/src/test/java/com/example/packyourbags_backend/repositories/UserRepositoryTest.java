package com.example.packyourbags_backend.repositories;

import com.example.packyourbags_backend.AbstractMysqlTest;
import com.example.packyourbags_backend.models.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
class UserRepositoryTest extends AbstractMysqlTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private UserRepository repo;

    @Test
    void saveAndFindUser() {
        User user = new User("JD", "John", "Doe", "john@example.com", "m", 180, 75.0F, "pass123");
        User saved = repo.save(user);

        User found = repo.findById(saved.getId()).orElse(null);

        assertNotNull(found);
        assertEquals("John", found.getName());
    }
}
