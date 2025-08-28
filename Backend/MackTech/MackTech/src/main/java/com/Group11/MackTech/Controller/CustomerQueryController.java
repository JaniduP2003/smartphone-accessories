package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.CustomerQueryDTO;
import com.Group11.MackTech.Service.CustomerQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queries")
public class CustomerQueryController {

    @Autowired
    private CustomerQueryService service;

    @PostMapping
    public ResponseEntity<CustomerQueryDTO> createQuery(@RequestBody CustomerQueryDTO dto) {
        return ResponseEntity.ok(service.createQuery(dto));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<CustomerQueryDTO>> getCustomerQueries(@RequestParam String email) {
        return ResponseEntity.ok(service.getQueriesByEmail(email));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<CustomerQueryDTO>> getAllQueries() {
        return ResponseEntity.ok(service.getAllQueries());
    }
}