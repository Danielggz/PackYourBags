package com.example.packyourbags_backend.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "trails")
public class Trail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //User info
    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    private User user;

    private String name;
    private String county;
    private String activityType;
    private String description;
    private String difficulty;
    private Integer lengthKm;
    private Integer completionTime;
    private Integer ascentMetres;
    private String links;
    private String website;

    public Trail() {}

    public Trail(Integer id, String name, String county, String activityType, String description, String difficulty, Integer lengthKm, Integer completionTime, Integer ascentMetres, String links, String website) {
        this.id = id;
        this.name = name;
        this.county = county;
        this.activityType = activityType;
        this.description = description;
        this.difficulty = difficulty;
        this.lengthKm = lengthKm;
        this.completionTime = completionTime;
        this.ascentMetres = ascentMetres;
        this.links = links;
        this.website = website;
    }

    //USER getter and setter


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getLengthKm() {
        return lengthKm;
    }

    public void setLengthKm(Integer lengthKm) {
        this.lengthKm = lengthKm;
    }

    public Integer getAscentMetres() {
        return ascentMetres;
    }

    public void setAscentMetres(Integer ascentMetres) {
        this.ascentMetres = ascentMetres;
    }

    public Integer getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(Integer completionTime) {
        this.completionTime = completionTime;
    }

    public String getLinks() {
        return links;
    }

    public void setLinks(String links) {
        this.links = links;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
}
