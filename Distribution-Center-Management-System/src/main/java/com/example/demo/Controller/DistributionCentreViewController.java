package com.example.demo.controller;

import com.example.demo.data.DistributionCentreRepository;
import com.example.demo.data.ItemRepository;
import com.example.demo.data.StockRepository;
import com.example.demo.model.Brand;
import com.example.demo.model.DistributionCentre;
import com.example.demo.model.Item;
import com.example.demo.model.Stock;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class DistributionCentreViewController {

    private final StockRepository stockRepo;
    private final ItemRepository itemRepo;
    private final DistributionCentreRepository centreRepo;

    // Show the form page
    @GetMapping("/request-item")
    public String showRequestForm() {
        return "request-item";
    }

    // Handle form submission
    @PostMapping("/distribution-centres/request-item")
    public String requestItemFromAnyCentre(@RequestParam String name,
            @RequestParam Brand brand,
            Model model) {
        List<Stock> stockList = stockRepo.findAll().stream()
                .filter(s -> s.getItem().getName().equalsIgnoreCase(name) &&
                        s.getItem().getBrand() == brand &&
                        s.getQuantity() > 0)
                .toList();

        if (stockList.isEmpty()) {
            model.addAttribute("message", "Item not found or out of stock in all centres.");
            return "error";
        }

        Stock stockToUpdate = stockList.get(0);
        stockToUpdate.setQuantity(stockToUpdate.getQuantity() - 1);
        stockRepo.save(stockToUpdate);

        model.addAttribute("item", stockToUpdate.getItem());
        model.addAttribute("centre", stockToUpdate.getDistributionCentre());
        return "success";
    }

    // Show form to add new item
    @GetMapping("/add-item")
    public String showAddItemForm() {
        return "add-item";
    }

    // Handle form submission for adding item
    @PostMapping("/add-item")
    public String addNewItemToCentre(@RequestParam Long centreId,
            @RequestParam String name,
            @RequestParam Brand brand,
            @RequestParam double price,
            @RequestParam int yearCreated,
            @RequestParam int quantity,
            Model model) {
        try {
            Item item = new Item();
            item.setName(name);
            item.setBrand(brand);
            item.setPrice(price);
            item.setYearCreated(yearCreated);
            item.setCreatedAt(new java.sql.Date(System.currentTimeMillis()));

            Item savedItem = itemRepo.save(item);

            DistributionCentre centre = centreRepo.findById(centreId)
                    .orElseThrow(() -> new RuntimeException("Centre not found"));

            Stock stock = new Stock(null, quantity, savedItem, centre);
            stockRepo.save(stock);

            model.addAttribute("item", savedItem);
            model.addAttribute("centre", centre);
            return "success";

        } catch (Exception e) {
            model.addAttribute("message", "Error adding item: " + e.getMessage());
            return "error";
        }
    }

    // Show form to delete item
    @GetMapping("/delete-item")
    public String showDeleteItemForm() {
        return "delete-item";
    }

    // Handle delete item
    @PostMapping("/delete-item")
    public String deleteItem(@RequestParam Long itemId, Model model) {
        try {
            Item item = itemRepo.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            for (Stock stock : item.getStockEntries()) {
                stock.getDistributionCentre().getStockEntries().remove(stock);
            }

            item.getStockEntries().clear();
            itemRepo.delete(item);

            model.addAttribute("message", "Item with ID " + itemId + " deleted successfully.");
            return "success";

        } catch (Exception e) {
            model.addAttribute("message", "Error deleting item: " + e.getMessage());
            return "error";
        }
    }

}
