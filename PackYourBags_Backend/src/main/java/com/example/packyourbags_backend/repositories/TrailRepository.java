package com.example.packyourbags_backend.repositories;

import com.example.packyourbags_backend.models.entities.Trail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrailRepository extends JpaRepository<Trail, Integer>{
    //Pull db info of trails by counties
    List<Trail> findByCounty(String county);
}
