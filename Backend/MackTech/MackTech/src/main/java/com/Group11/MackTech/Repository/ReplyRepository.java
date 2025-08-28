package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.Reply;
import com.Group11.MackTech.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {
    Optional<Reply> findByReview(Review review);
} 