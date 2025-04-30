package com.example.demo.model;

public enum Brand {
    BALENCIAGA("BALENCIAGA"), GUCCI("GUCCI"), LOUIS_VUITTON("LOUIS_VUITTON"), PRADA("PRADA"), VERSACE("VERSACE");

    public final String name;

    private Brand(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
