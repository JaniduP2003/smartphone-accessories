package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.ReplyDTO;
import com.Group11.MackTech.DTO.ReplyRequestDTO;
import com.Group11.MackTech.Service.ReplyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/replies")
@CrossOrigin(origins = "*")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @PostMapping("/review/{reviewId}")
    public ResponseEntity<ReplyDTO> addReply(
            @PathVariable Long reviewId,
            @RequestBody @Valid ReplyRequestDTO request) {
        ReplyDTO replyDTO = replyService.addReply(reviewId, request.getContent());
        return new ResponseEntity<>(replyDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{replyId}")
    public ResponseEntity<ReplyDTO> updateReply(
            @PathVariable Long replyId,
            @RequestBody @Valid ReplyRequestDTO request) {
        ReplyDTO updatedReply = replyService.updateReply(replyId, request.getContent());
        return ResponseEntity.ok(updatedReply);
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<ReplyDTO> getReplyByReviewId(@PathVariable Long reviewId) {
        ReplyDTO replyDTO = replyService.getReplyByReviewId(reviewId);
        return ResponseEntity.ok(replyDTO);
    }
} 