package com.prahlad.ecommerce.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.user.UserResponse;

@Service
public interface AdminService 
{

    String approveMerchant(Long merchantId);

    List<UserResponse> getAllUsers();

    List<MerchantResponse> getAllMerchants();

    String blockMerchant(Long merchantId);

    String unblockMerchant(Long merchantId);

    List<OrderResponse> getAllOrders();
}