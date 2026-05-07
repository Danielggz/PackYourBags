package com.example.packyourbags_backend.dtos;

import java.time.LocalDate;

public class GeneratePlanRequest {
    private Integer trailId;
    private LocalDate plannedDate;

    public Integer getTrailId() {
        return trailId;
    }

    public void setTrailId(Integer trailId) {
        this.trailId = trailId;
    }

    public LocalDate getPlannedDate() {
        return plannedDate;
    }

    public void setPlannedDate(LocalDate plannedDate) {
        this.plannedDate = plannedDate;
    }
}
