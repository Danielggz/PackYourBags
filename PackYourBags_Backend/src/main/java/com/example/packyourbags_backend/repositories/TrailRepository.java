package com.example.packyourbags_backend.repositories;

import com.example.packyourbags_backend.models.entities.Trail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrailRepository extends JpaRepository<Trail, Integer>{
}
