package com.prahlad.ecommerce.service.admin;

import org.springframework.stereotype.Service;

@Service
public interface AdminService 
{

    String approveMerchant(Long merchantId);

}