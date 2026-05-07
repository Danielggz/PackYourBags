package com.example.packyourbags_backend.dtos.apiRequest;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TrailApiResponse {
    private List<TrailFeature> features;
    private String type;


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<TrailFeature> getFeatures() {
        return features;
    }

    public void setFeatures(List<TrailFeature> features) {
        this.features = features;
    }

    @Override
    public String toString() {
        return "TrailApiResponse{features=" + features + "}";
    }
}
