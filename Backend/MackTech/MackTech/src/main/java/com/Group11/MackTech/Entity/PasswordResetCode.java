package com.Group11.MackTech.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "password_reset_code")
@Getter
@Setter
public class PasswordResetCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    private String verificationCode;

    public PasswordResetCode() {
    }

    public PasswordResetCode(int id, String verificationCode) {
        Id = id;
        this.verificationCode = verificationCode;
    }

    @Override
    public String toString() {
        return "PasswordResetCode{" +
                "Id=" + Id +
                ", verificationCode='" + verificationCode + '\'' +
                '}';
    }
}
