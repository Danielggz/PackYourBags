package com.example.packyourbags_backend.dtos;

public class UserDto {
    private Integer id;
    private String name;
    private String county;

    public UserDto() {}

    public UserDto(Integer id, String name, String county) {
        this.id = id;
        this.name = name;
        this.county = county;
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
}
