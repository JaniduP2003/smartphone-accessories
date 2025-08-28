package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.CustomerQuery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerQueryRepository extends JpaRepository<CustomerQuery, Long> {
    List<CustomerQuery> findByEmail(String email);
}