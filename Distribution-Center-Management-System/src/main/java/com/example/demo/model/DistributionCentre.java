package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistributionCentre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double latitude;
    private double longitude;

    @OneToMany(mappedBy = "distributionCentre", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Stock> stockEntries = new ArrayList<>();
}
