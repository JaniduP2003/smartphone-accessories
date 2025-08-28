package com.Group11.MackTech.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "review_replies")
public class Reply {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long replyId;
    
    @OneToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;
    
    @Column(nullable = false, length = 1000)
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime dateCreated;
    
    @Column
    private LocalDateTime lastModified;
    
    @PrePersist
    protected void onCreate() {
        dateCreated = LocalDateTime.now();
        lastModified = dateCreated;
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModified = LocalDateTime.now();
    }
} 