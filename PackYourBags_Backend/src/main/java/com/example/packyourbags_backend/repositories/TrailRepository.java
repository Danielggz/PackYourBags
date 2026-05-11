package com.example.packyourbags_backend.repositories;

import com.example.packyourbags_backend.models.entities.Trail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrailRepository extends JpaRepository<Trail, Integer>{
    //Pull db info of trails by counties
    boolean existsByUserIdAndTrailType(Integer userId, String trailType);
    Optional<Trail> findByUserIdAndTrailType(Integer userId, String trailType);
    List<Trail> findAllByUserIdAndTrailType(Integer userId, String trailType);
}
