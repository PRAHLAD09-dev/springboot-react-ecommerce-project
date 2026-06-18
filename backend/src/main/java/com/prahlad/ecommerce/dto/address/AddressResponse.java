package com.prahlad.ecommerce.dto.address;

import com.prahlad.ecommerce.enums.AddressType;

public record AddressResponse(
	    Long id,
	    AddressType addressType,
	    String phoneNumber,
	    String street,
	    String city,
	    String state,
	    String zipCode,
	    String country
	) {}