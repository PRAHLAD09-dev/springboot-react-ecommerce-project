package com.prahlad.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.notification.PromotionRequest;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.service.admin.AdminService;
import com.prahlad.ecommerce.service.admin.PromotionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController 
{

	private final AdminService adminService;
	private final PromotionService promotionService;

	@GetMapping("/dashboard")
	public ApiResponse<Map<String, Long>> dashboard() 
	{
		return ApiResponse.success("Dashboard data", adminService.getDashboardStats());
	}

	@PostMapping("/promotion")
	public ApiResponse<String> sendPromotion(@RequestBody PromotionRequest request) 
	{
		promotionService.sendPromotionToAllUsers(request.title(), request.message());

		return ApiResponse.success("Promotion sent successfully", null);
	}
	
	@PutMapping("/approve/{merchantId}")
	public ApiResponse<String> approveMerchant(@PathVariable Long merchantId) 
	{
		return ApiResponse.success("Merchant approved successfully", adminService.approveMerchant(merchantId));
	}

	@GetMapping("/merchants")
	public ApiResponse<List<MerchantResponse>> getMerchants() 
	{
		return ApiResponse.success("Merchants fetched successfully", adminService.getAllMerchants());
	}

	@GetMapping("/users")
	public ApiResponse<List<UserResponse>> getAllUsers() 
	{
		return ApiResponse.success("Users fetched successfully", adminService.getAllUsers());
	}

	@PutMapping("/block/{merchantId}")
	public ApiResponse<String> blockMerchant(@PathVariable Long merchantId) 
	{
		return ApiResponse.success("Merchant blocked successfully", adminService.blockMerchant(merchantId));
	}

	@PutMapping("/unblock/{merchantId}")
	public ApiResponse<String> unblockMerchant(@PathVariable Long merchantId) 
	{
		return ApiResponse.success("Merchant unblocked successfully", adminService.unblockMerchant(merchantId));
	}

	@GetMapping("/orders")
	public ApiResponse<List<OrderResponse>> getAllOrders() 
	{
		return ApiResponse.success("Orders fetched successfully", adminService.getAllOrders());
	}
}