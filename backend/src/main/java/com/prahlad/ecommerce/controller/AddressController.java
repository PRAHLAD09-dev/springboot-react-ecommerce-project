package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.prahlad.ecommerce.dto.address.AddressRequest;
import com.prahlad.ecommerce.dto.address.AddressResponse;
import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.service.address.AddressService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/address")
@PreAuthorize("hasAnyRole('USER')")
@RequiredArgsConstructor
public class AddressController 
{

	private final AddressService addressService;

	@PostMapping
	public ApiResponse<AddressResponse> addAddress(@RequestBody AddressRequest request, Authentication auth) 
	{

		return ApiResponse.success("Address added successfully", addressService.addAddress(request, auth.getName()));
	}

	@GetMapping
	public ApiResponse<List<AddressResponse>> getAddresses(Authentication auth) 
	{

		return ApiResponse.success("Addresses fetched", addressService.getUserAddresses(auth.getName()));
	}

	@PutMapping("/{id}")
	public ApiResponse<AddressResponse> updateAddress(@PathVariable Long id, @RequestBody AddressRequest request,
			Authentication auth) 
	{

		return ApiResponse.success("Address updated", addressService.updateAddress(id, request, auth.getName()));
	}

	@DeleteMapping("/{id}")
	public ApiResponse<String> deleteAddress(@PathVariable Long id, Authentication auth) 
	{

		addressService.deleteAddress(id, auth.getName());

		return ApiResponse.success("Address deleted successfully", null);
	}
}