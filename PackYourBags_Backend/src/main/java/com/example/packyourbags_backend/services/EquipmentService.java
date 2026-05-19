package com.example.packyourbags_backend.services;

import com.example.packyourbags_backend.models.entities.Equipment;
import com.example.packyourbags_backend.models.entities.User;
import com.example.packyourbags_backend.repositories.EquipmentRepository;
import com.example.packyourbags_backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    public EquipmentService(EquipmentRepository equipmentRepository, UserRepository userRepository) {
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
    }

    public List<Equipment> getEquipment(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return equipmentRepository.findByUser(user);
    }

    public void saveEquipment(Integer userId, List<Equipment> items) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Delete old equipment
        equipmentRepository.deleteByUser(user);

        //save new data
        for (Equipment item : items) {
            item.setUser(user);
            equipmentRepository.save(item);
        }
    }
}
