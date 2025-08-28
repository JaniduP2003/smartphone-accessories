package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.ReviewDTO;
import com.Group11.MackTech.DTO.ReviewRequestDTO;
import com.Group11.MackTech.Service.ReviewService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getReviewsByProductId(
            @PathVariable Long productId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> addReview(
            @Valid @RequestBody ReviewRequestDTO reviewRequestDTO,
            @RequestParam Long customerId) {
        ReviewDTO reviewDTO = reviewService.addReview(customerId, reviewRequestDTO);
        return new ResponseEntity<>(reviewDTO, HttpStatus.CREATED);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam Long customerId) {
        reviewService.deleteReview(reviewId, customerId);
        return ResponseEntity.noContent().build();
    }
}