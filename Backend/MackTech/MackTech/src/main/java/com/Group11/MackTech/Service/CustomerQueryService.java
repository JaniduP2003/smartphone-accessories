package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.CustomerQueryDTO;
import com.Group11.MackTech.Entity.CustomerQuery;
import com.Group11.MackTech.Repository.CustomerQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerQueryService {

    @Autowired
    private CustomerQueryRepository repository;

    public CustomerQueryDTO createQuery(CustomerQueryDTO dto) {
        CustomerQuery query = new CustomerQuery();
        query.setCustomerName(dto.getCustomerName());
        query.setEmail(dto.getEmail());
        query.setSubject(dto.getSubject());
        query.setMessage(dto.getMessage());

        CustomerQuery saved = repository.save(query);
        dto.setId(saved.getId());
        return dto;
    }

    public List<CustomerQueryDTO> getAllQueries() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CustomerQueryDTO> getQueriesByEmail(String email) {
        return repository.findByEmail(email).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private CustomerQueryDTO toDTO(CustomerQuery query) {
        return new CustomerQueryDTO(
                query.getId(),
                query.getCustomerName(),
                query.getEmail(),
                query.getSubject(),
                query.getMessage()
        );
    }
}