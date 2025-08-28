package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.ReplyDTO;
import com.Group11.MackTech.DTO.ReviewDTO;
import com.Group11.MackTech.DTO.ReviewRequestDTO;
import com.Group11.MackTech.Entity.Customer;
import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.Entity.Review;
import com.Group11.MackTech.Entity.Reply;
import com.Group11.MackTech.Repository.CustomerRepository;
import com.Group11.MackTech.Repository.ProductRepository;
import com.Group11.MackTech.Repository.ReviewRepository;
import com.Group11.MackTech.Repository.ReplyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ReplyRepository replyRepository;

    public Page<ReviewDTO> getReviewsByProductId(Long productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Product not found with id: " + productId));

        return reviewRepository.findByProduct(product, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public ReviewDTO addReview(Long customerId, ReviewRequestDTO reviewRequestDTO) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Customer not found with id: " + customerId));

        Product product = productRepository.findById(reviewRequestDTO.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Product not found with id: " + reviewRequestDTO.getProductId()));

        // Check if customer has already reviewed this product
        if (reviewRepository.existsByCustomerAndProduct(customer, product)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "You have already reviewed this product");
        }

        Review review = new Review();
        review.setCustomer(customer);
        review.setProduct(product);
        review.setDescription(reviewRequestDTO.getDescription());
        
        return convertToDTO(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, Long customerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Review not found with id: " + reviewId));
        
        // Check if the customer is the owner of the review
        if (!review.getCustomer().getId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "You don't have permission to delete this review");
        }

        // Delete associated reply if it exists
        replyRepository.findByReview(review).ifPresent(reply -> replyRepository.delete(reply));

        reviewRepository.delete(review);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setReviewId(review.getReviewId());
        reviewDTO.setCustomerId(review.getCustomer().getId());
        reviewDTO.setCustomerUsername(review.getCustomer().getUsername());
        reviewDTO.setProductId(review.getProduct().getPid());
        reviewDTO.setProductName(review.getProduct().getPname());
        reviewDTO.setDescription(review.getDescription());
        reviewDTO.setDateCreated(review.getDateCreated());
        
        // Include reply if it exists
        replyRepository.findByReview(review).ifPresent(reply -> {
            reviewDTO.setReply(new ReplyDTO(
                reply.getReplyId(),
                reply.getReview().getReviewId(),
                reply.getContent(),
                reply.getDateCreated(),
                reply.getLastModified()
            ));
        });
        
        return reviewDTO;
    }
}