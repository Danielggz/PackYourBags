package com.example.packyourbags_backend.services;

import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.UserRepository;
import com.example.packyourbags_backend.config.SecurityConfig;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo,  PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User createUser(User user) {
        String hashed = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashed);
        return repo.save(user);
    }

    public User getUser(int id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteUser(int id) {
        repo.deleteById(id);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> user = repo.findByEmail(email);

        if (user.isPresent()) {
            boolean matches = passwordEncoder.matches(password, user.get().getPassword());
            if (matches) {
                return user;
            }
        }

        return Optional.empty();
    }
}

