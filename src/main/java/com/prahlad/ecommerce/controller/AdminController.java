package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.prahlad.ecommerce.service.admin.AdminService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController 
{

	private final AdminService adminService;
	
    @GetMapping("/dashboard")
    public String adminDashboard() 
    {
        return "Admin access granted";
    }
    
    @PutMapping("/approve/{merchantId}")
    public String approveMerchant(@PathVariable Long merchantId) 
    {
        return adminService.approveMerchant(merchantId);
    }
}
