package com.prahlad.ecommerce.service.merchant;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantUpdateRequest;

@Service
public interface MerchantService 
{

	MerchantResponse getProfile(String email);

	MerchantResponse updateProfile(String email, MerchantUpdateRequest updatedMerchant);

    String changePassword(String email, String oldPassword, String newPassword);

    void deleteAccount(String email);
}