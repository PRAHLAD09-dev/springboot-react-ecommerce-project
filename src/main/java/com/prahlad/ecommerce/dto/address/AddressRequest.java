package com.prahlad.ecommerce.dto.address;

public record AddressRequest(
    String street,
    String city,
    String state,
    String zipCode
) {}