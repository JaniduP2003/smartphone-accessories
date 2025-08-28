package com.Group11.MackTech.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyRequestDTO {
    @NotBlank(message = "Reply content is required")
    @Size(min = 1, max = 1000, message = "Reply content must be between 1 and 1000 characters")
    private String content;
} 