package com.example.packyourbags_backend.controllers;

import com.example.packyourbags_backend.dtos.LoginDto;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.services.UserService;
import com.example.packyourbags_backend.repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;
    private final UserRepository repo;

    public UserController(UserService service, UserRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PostMapping("/createUser")
    public User createUser(@RequestBody User user) {
        return service.createUser(user);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return service.getUser(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        service.deleteUser(id);
    }

    //Create mock user to test
    @PostMapping("/test")
    public User testDatabase() {
        User u = new User("TestUser", "user", "userson", "test@example.com", "m", "Wiclow", 171, 72.5F, "abc123.");
        return repo.save(u);
    }

    //Login function
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto request, HttpSession session) {
        Optional<User> user = service.login(request.getEmail(), request.getPassword());

        if (user.isPresent()) {
            //Extract user obj from optional
            User u =  user.get();
            //If user exists, create a session and return ok response
            session.setAttribute("userId", u.getId()); //Extract user obj from optional
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    //Session check
    @GetMapping("/sessionCheck")
    public ResponseEntity<?> checkSession(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        return ResponseEntity.ok("Logged in");
    }
}

