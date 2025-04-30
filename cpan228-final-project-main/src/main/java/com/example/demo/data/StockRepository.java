package com.example.demo.data;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
}
