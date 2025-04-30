package com.example.demo.data;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Brand;
import com.example.demo.model.Item;
import java.util.Optional;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findItemByName(String name);

    Optional<Item> findItemById(Long id);

    List<Item> findByBrandAndYearCreated(Brand brand, int year);

    List<Item> findByBrandAndName(Brand brand, String name);
}
