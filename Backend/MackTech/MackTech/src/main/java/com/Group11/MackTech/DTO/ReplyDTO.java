package com.Group11.MackTech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyDTO {
    private Long replyId;
    private Long reviewId;
    private String content;
    private LocalDateTime dateCreated;
    private LocalDateTime lastModified;
} 