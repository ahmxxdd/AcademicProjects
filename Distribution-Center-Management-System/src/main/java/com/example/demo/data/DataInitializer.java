package com.example.demo.data;

import com.example.demo.model.*;
import com.example.demo.data.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

        private final DistributionCentreRepository centreRepo;
        private final ItemRepository itemRepo;
        private final StockRepository stockRepo;

        @Bean
        public CommandLineRunner initData() {
                return args -> {
                        // Create distribution centres with mutable lists
                        DistributionCentre toronto = new DistributionCentre(null, "Toronto", 43.65, -79.34,
                                        new ArrayList<>());
                        DistributionCentre vancouver = new DistributionCentre(null, "Vancouver", 49.28, -123.12,
                                        new ArrayList<>());
                        DistributionCentre montreal = new DistributionCentre(null, "Montreal", 45.50, -73.56,
                                        new ArrayList<>());
                        DistributionCentre ottawa = new DistributionCentre(null, "Ottawa", 45.42, -75.69,
                                        new ArrayList<>());

                        centreRepo.saveAll(Arrays.asList(toronto, vancouver, montreal, ottawa));

                        // Create items with mutable stock lists
                        Item jacket = new Item(null, "Sports Jacket", Brand.GUCCI, 79.99, 2023,
                                        new Date(System.currentTimeMillis()), new ArrayList<>());
                        Item shoes = new Item(null, "Running Shoes", Brand.LOUIS_VUITTON, 59.99, 2022,
                                        new Date(System.currentTimeMillis()), new ArrayList<>());
                        Item tracksuit = new Item(null, "Tracksuit", Brand.PRADA, 89.99, 2024,
                                        new Date(System.currentTimeMillis()), new ArrayList<>());
                        Item socks = new Item(null, "Socks", Brand.LOUIS_VUITTON, 109.79, 2022,
                                        new Date(System.currentTimeMillis()), new ArrayList<>());
                        Item bracelet = new Item(null, "Bracelet", Brand.VERSACE, 29.50, 2023,
                                        new Date(System.currentTimeMillis()), new ArrayList<>());

                        itemRepo.saveAll(Arrays.asList(jacket, shoes, tracksuit, socks, bracelet));

                        // Create stock entries
                        Stock s1 = new Stock(null, 25, jacket, toronto);
                        Stock s2 = new Stock(null, 10, jacket, vancouver);
                        Stock s3 = new Stock(null, 40, shoes, toronto);
                        Stock s4 = new Stock(null, 30, tracksuit, vancouver);
                        Stock s5 = new Stock(null, 10, socks, montreal);
                        Stock s6 = new Stock(null, 17, bracelet, ottawa);

                        // Maintain bidirectional references
                        toronto.getStockEntries().addAll(List.of(s1, s3));
                        vancouver.getStockEntries().addAll(List.of(s2, s4));
                        montreal.getStockEntries().add(s5);
                        ottawa.getStockEntries().add(s6);

                        jacket.getStockEntries().addAll(List.of(s1, s2));
                        shoes.getStockEntries().add(s3);
                        tracksuit.getStockEntries().add(s4);
                        socks.getStockEntries().add(s5);
                        bracelet.getStockEntries().add(s6);

                        // Save stocks
                        stockRepo.saveAll(List.of(s1, s2, s3, s4, s5, s6));
                };
        }
}
