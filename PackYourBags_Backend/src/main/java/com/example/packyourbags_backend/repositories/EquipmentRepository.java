package com.example.packyourbags_backend.repositories;

import com.example.packyourbags_backend.models.entities.Equipment;
import com.example.packyourbags_backend.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Integer> {

    List<Equipment> findByUser(User user);

    void deleteByUser(User user);
}
