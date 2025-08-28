package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.ReplyDTO;
import com.Group11.MackTech.Entity.Reply;
import com.Group11.MackTech.Entity.Review;
import com.Group11.MackTech.Repository.ReplyRepository;
import com.Group11.MackTech.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public ReplyDTO addReply(Long reviewId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reply content cannot be empty");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Review not found with id: " + reviewId));

        // Check if reply already exists
        if (replyRepository.findByReview(review).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "A reply already exists for this review");
        }

        Reply reply = new Reply();
        reply.setReview(review);
        reply.setContent(content.trim());

        Reply savedReply = replyRepository.save(reply);
        return convertToDTO(savedReply);
    }

    @Transactional
    public ReplyDTO updateReply(Long replyId, String newContent) {
        if (newContent == null || newContent.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reply content cannot be empty");
        }

        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Reply not found with id: " + replyId));

        reply.setContent(newContent.trim());
        Reply updatedReply = replyRepository.save(reply);
        return convertToDTO(updatedReply);
    }

    @Transactional
    public void deleteReply(Long replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Reply not found with id: " + replyId));

        replyRepository.delete(reply);
    }

    public ReplyDTO getReplyByReviewId(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Review not found with id: " + reviewId));

        Reply reply = replyRepository.findByReview(review)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "No reply found for review with id: " + reviewId));

        return convertToDTO(reply);
    }

    private ReplyDTO convertToDTO(Reply reply) {
        return new ReplyDTO(
            reply.getReplyId(),
            reply.getReview().getReviewId(),
            reply.getContent(),
            reply.getDateCreated(),
            reply.getLastModified()
        );
    }
} 