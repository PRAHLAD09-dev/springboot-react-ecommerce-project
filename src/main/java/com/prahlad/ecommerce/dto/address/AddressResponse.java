package com.prahlad.ecommerce.dto.address;

public record AddressResponse(
    Long id,
    String street,
    String city,
    String state,
    String zipCode
) {}