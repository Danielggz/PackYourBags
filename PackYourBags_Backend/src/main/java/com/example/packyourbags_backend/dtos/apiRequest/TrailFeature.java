package com.example.packyourbags_backend.dtos.apiRequest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TrailFeature {
    private String type;
    private TrailProperties properties;

    public TrailProperties getProperties() {
        return properties;
    }

    public void setProperties(TrailProperties properties) {
        this.properties = properties;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
