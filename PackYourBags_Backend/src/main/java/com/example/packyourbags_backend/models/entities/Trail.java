package com.example.packyourbags_backend.models.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "trails")
public class Trail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //User full information using idUser join
    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    private User user;

    private Integer idTrail;
    private String name;
    private String county;
    @Column(name = "activityType") //Force Hibernate to respect camelCase
    private String activityType;
    private String description;
    private String difficulty;
    @Column(name = "lengthKm")
    private Integer lengthKm;
    @Column(name = "completionTime")
    private String completionTime;
    @Column(name = "ascentMetres")
    private Integer ascentMetres;
    private String links;
    private String SI_website;
    @Column(name = "plannedActivityDate")
    private LocalDate plannedActivityDate;
    @Column(name = "trailType")
    private String trailType;

    public Trail() {}

    public Trail(Integer id, Integer idTrail, String name, String county, String activityType, String description, String difficulty, Integer lengthKm, String completionTime, Integer ascentMetres, String links, String SI_website, LocalDate plannedActivityDate, String trailType) {
        this.id = id;
        this.idTrail = idTrail;
        this.name = name;
        this.county = county;
        this.activityType = activityType;
        this.description = description;
        this.difficulty = difficulty;
        this.lengthKm = lengthKm;
        this.completionTime = completionTime;
        this.ascentMetres = ascentMetres;
        this.links = links;
        this.SI_website = SI_website;
        this.plannedActivityDate = plannedActivityDate;
        this.trailType = trailType;
    }

    //USER getter and setter
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(String completionTime) {
        this.completionTime = completionTime;
    }

    public String getLinks() {
        return links;
    }

    public void setLinks(String links) {
        this.links = links;
    }

    public String getSI_website() {
        return SI_website;
    }

    public void setSI_website(String SI_website) {
        this.SI_website = SI_website;
    }

    public LocalDate getPlannedActivityDate() {
        return plannedActivityDate;
    }

    public void setPlannedActivityDate(LocalDate plannedActivityDate) {
        this.plannedActivityDate = plannedActivityDate;
    }

    public Integer getIdTrail() {
        return idTrail;
    }

    public void setIdTrail(Integer trailId) {
        this.idTrail = trailId;
    }

    public String getTrailType() {
        return trailType;
    }

    public void setTrailType(String trailType) {
        this.trailType = trailType;
    }
}
