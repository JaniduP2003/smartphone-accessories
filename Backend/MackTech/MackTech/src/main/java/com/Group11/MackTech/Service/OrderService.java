package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.OrderDTO;
import com.Group11.MackTech.Entity.Order;
import com.Group11.MackTech.OrderStatus;
import com.Group11.MackTech.PaymentMethod;
import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.exception.ValidationException;
import com.Group11.MackTech.Repository.OrderRepository;
import com.Group11.MackTech.Repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    private static final String UPLOAD_DIR = "uploads/receipts/";

    @Transactional
    public Order createOrder(OrderDTO orderDTO, MultipartFile receipt) throws IOException {
        // Validate input
        Map<String, String> errors = validateOrder(orderDTO, receipt);
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        Order order = new Order();
        order.setFirstName(orderDTO.getFirstName());
        order.setLastName(orderDTO.getLastName());
        order.setEmail(orderDTO.getEmail());
        order.setMobile(orderDTO.getMobile());
        order.setAddress(orderDTO.getAddress());
        order.setCity(orderDTO.getCity());
        order.setState(orderDTO.getState());
        order.setPostalCode(orderDTO.getPostalCode());
        order.setPaymentMethod(PaymentMethod.fromString(orderDTO.getPaymentMethod()));
        order.setStatus(OrderStatus.PENDING);
        order.setSubtotal(orderDTO.getSubtotal());
        order.setDeliveryFee(orderDTO.getDeliveryFee());
        order.setTax(orderDTO.getTax());
        order.setTotal(orderDTO.getTotal());
        order.setCreatedAt(LocalDateTime.now());

        List<Product> products = productRepository.findAllById(orderDTO.getProductIds());
        order.setProducts(products);

        if (orderDTO.getPaymentMethod().equals("bankTransfer") && receipt != null && !receipt.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + receipt.getOriginalFilename();
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) directory.mkdirs();
            receipt.transferTo(new File(UPLOAD_DIR + fileName));
            order.setReceiptFilePath(UPLOAD_DIR + fileName);
        }

        return orderRepository.save(order);
    }

    private Map<String, String> validateOrder(OrderDTO orderDTO, MultipartFile receipt) {
        Map<String, String> errors = new HashMap<>();

        // Required fields
        if (orderDTO.getFirstName() == null || orderDTO.getFirstName().isBlank()) {
            errors.put("firstName", "First name is required");
        }
        if (orderDTO.getLastName() == null || orderDTO.getLastName().isBlank()) {
            errors.put("lastName", "Last name is required");
        }
        if (orderDTO.getEmail() == null || orderDTO.getEmail().isBlank()) {
            errors.put("email", "Email is required");
        } else if (!orderDTO.getEmail().matches("\\S+@\\S+\\.\\S+")) {
            errors.put("email", "Invalid email format");
        }
        if (orderDTO.getMobile() == null || orderDTO.getMobile().isBlank()) {
            errors.put("mobile", "Mobile number is required");
        } else if (!orderDTO.getMobile().matches("\\d{10}")) {
            errors.put("mobile", "Mobile number must be 10 digits");
        }
        if (orderDTO.getAddress() == null || orderDTO.getAddress().isBlank()) {
            errors.put("address", "Address is required");
        }
        if (orderDTO.getCity() == null || orderDTO.getCity().isBlank()) {
            errors.put("city", "City is required");
        }
        if (orderDTO.getState() == null || orderDTO.getState().isBlank()) {
            errors.put("state", "State is required");
        }
        if (orderDTO.getPostalCode() == null || orderDTO.getPostalCode().isBlank()) {
            errors.put("postalCode", "Postal code is required");
        }
        if (orderDTO.getPaymentMethod() == null || orderDTO.getPaymentMethod().isBlank()) {
            errors.put("paymentMethod", "Payment method is required");
        } else {
            try {
                PaymentMethod.fromString(orderDTO.getPaymentMethod());
            } catch (IllegalArgumentException e) {
                errors.put("paymentMethod", "Invalid payment method");
            }
        }
        if (orderDTO.getProductIds() == null || orderDTO.getProductIds().isEmpty()) {
            errors.put("productIds", "At least one product is required");
        }
        if (orderDTO.getSubtotal() <= 0) {
            errors.put("subtotal", "Subtotal must be greater than 0");
        }
        if (orderDTO.getTotal() <= 0) {
            errors.put("total", "Total must be greater than 0");
        }

        // Receipt validation for bank transfer
        if ("bankTransfer".equals(orderDTO.getPaymentMethod()) && (receipt == null || receipt.isEmpty())) {
            errors.put("receipt", "Receipt is required for bank transfer");
        }

        return errors;
    }

    @Transactional
    public Order confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}

