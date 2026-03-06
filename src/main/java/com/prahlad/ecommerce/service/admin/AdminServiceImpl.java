package com.prahlad.ecommerce.service.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.repository.MerchantRepository;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService 
{

    private final MerchantRepository merchantRepository;

    @Override
    public String approveMerchant(Long merchantId) 
    {

        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        if (merchant.isApproved()) 
        {
            return "Merchant already approved";
        }

        merchant.setApproved(true);
        merchantRepository.save(merchant);

        return "Merchant approved successfully";
    }
}