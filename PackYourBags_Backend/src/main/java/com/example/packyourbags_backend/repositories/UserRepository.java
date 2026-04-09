package com.example.packyourbags_backend.repositories;

import com.example.packyourbags_backend.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
