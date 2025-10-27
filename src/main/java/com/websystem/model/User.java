package com.websystem.model;

public class User {
    private String id;
    private String login;
    private String hashedPassword;

    public User() {}

    public User(String id, String login, String hashedPassword) {
        this.id = id;
        this.login = login;
        this.hashedPassword = hashedPassword;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }
}
