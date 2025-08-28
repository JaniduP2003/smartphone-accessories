package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
