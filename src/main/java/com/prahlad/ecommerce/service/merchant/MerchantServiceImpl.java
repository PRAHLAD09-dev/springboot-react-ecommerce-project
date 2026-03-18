package com.prahlad.ecommerce.service.merchant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantUpdateRequest;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.MerchantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MerchantServiceImpl implements MerchantService 
{

    private final MerchantRepository merchantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public MerchantResponse getProfile(String email) 
    {

        Merchant merchant = merchantRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

        return mapToDTO(merchant);
    }

    @Override
    public MerchantResponse updateProfile(String email, MerchantUpdateRequest request) 
    {

        Merchant merchant = merchantRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

        if (request.businessName() != null) 
        {
            merchant.setBusinessName(request.businessName());
        }

        merchantRepository.save(merchant);

        return mapToDTO(merchant);
    }

    @Override
    public String changePassword(String email, String oldPassword, String newPassword) 
    {

        Merchant merchant = merchantRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

        if (!passwordEncoder.matches(oldPassword, merchant.getPassword())) 
        {
            throw new BadRequestException("Old password is incorrect");
        }

        merchant.setPassword(passwordEncoder.encode(newPassword));

        merchantRepository.save(merchant);

        return "Password changed successfully";
    }

    @Override
    public void deleteAccount(String email) 
    {

        Merchant merchant = merchantRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

        merchantRepository.delete(merchant);
    }

    private MerchantResponse mapToDTO(Merchant merchant) 
    {
        return new MerchantResponse(
                merchant.getId(),
                merchant.getBusinessName(),
                merchant.getEmail(),
                merchant.isApproved(),
                merchant.isActive()
        );
    }
}