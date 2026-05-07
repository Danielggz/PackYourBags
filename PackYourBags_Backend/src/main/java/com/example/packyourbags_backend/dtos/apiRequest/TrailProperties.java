package com.example.packyourbags_backend.dtos.apiRequest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TrailProperties {
    private Integer TrailID;
    private String Name;
    private String County;
    private String Activity;
    private String Description;
    private String Difficulty;
    private Integer LengthKm;
    private String TimeToComplete;
    private Integer AscentMetres;
    private String ExternalLinks;
    private String Website;

    public Integer getTrailID() {
        return TrailID;
    }

    public void setTrailID(Integer trailID) {
        TrailID = trailID;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getCounty() {
        return County;
    }

    public void setCounty(String county) {
        County = county;
    }

    public String getActivity() {
        return Activity;
    }

    public void setActivity(String activity) {
        Activity = activity;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getDifficulty() {
        return Difficulty;
    }

    public void setDifficulty(String difficulty) {
        Difficulty = difficulty;
    }

    public Integer getLengthKm() {
        return LengthKm;
    }

    public void setLengthKm(Integer lengthKm) {
        LengthKm = lengthKm;
    }

    public String getTimeToComplete() {
        return TimeToComplete;
    }

    public void setTimeToComplete(String timeToComplete) {
        TimeToComplete = timeToComplete;
    }

    public Integer getAscentMetres() {
        return AscentMetres;
    }

    public void setAscentMetres(Integer ascentMetres) {
        AscentMetres = ascentMetres;
    }

    public String getExternalLinks() {
        return ExternalLinks;
    }

    public void setExternalLinks(String externalLinks) {
        ExternalLinks = externalLinks;
    }

    public String getWebsite() {
        return Website;
    }

    public void setWebsite(String website) {
        Website = website;
    }
}


