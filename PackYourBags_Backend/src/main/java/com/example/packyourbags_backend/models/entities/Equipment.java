package com.example.packyourbags_backend.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //User full information using idUser join
    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    private User user;

    private Integer itemId;
    private String name;
    private boolean checked;

    public Equipment() {}

    public Equipment(User user, String name, Integer itemId, boolean checked) {
        this.user = user;
        this.name = name;
        this.itemId = itemId;
        this.checked = checked;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }
}
