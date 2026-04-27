package com.prahlad.ecommerce.dto.address;

public record AddressResponse(
    Long id,
    String fullName,
	String phoneNumber,
    String street,
    String city,
    String state,
    String zipCode,
    String country
) {}