package com.Group11.MackTech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long reviewId;
    private Long customerId;
    private String customerUsername;
    private Long productId;
    private String productName;
    private String description;
    private LocalDateTime dateCreated;
    private ReplyDTO reply;
}