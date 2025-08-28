package com.Group11.MackTech.DTO;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String phoneNo;
    private String address;
    private String role;
}
