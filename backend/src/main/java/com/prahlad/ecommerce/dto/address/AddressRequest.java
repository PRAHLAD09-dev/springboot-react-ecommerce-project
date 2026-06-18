package com.prahlad.ecommerce.dto.address;



import com.prahlad.ecommerce.enums.AddressType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(

		@NotNull(message = "Address type is required")
		AddressType addressType,

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "^[6-9]\\d{9}$",
                message = "Phone number must be 10 digits"
        )
        String phoneNumber,

        @NotBlank(message = "Street is required")
        @Size(max = 100, message = "Street cannot exceed 100 characters")
        String street,

        @NotBlank(message = "City is required")
        @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "City must contain only letters"
        )
        String city,

        @NotBlank(message = "State is required")
        @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "State must contain only letters"
        )
        String state,
        
        @NotBlank(message = "Zip code is required")
        @Pattern(
                regexp = "^[0-9]{6}$",
                message = "Zip code must be 6 digits"
        )
        String zipCode,

        @NotBlank(message = "Country is required")
		@Pattern(
		    regexp = "^[A-Za-z ]+$",
		    message = "Country must contain only letters"
		)
		String country

) {}