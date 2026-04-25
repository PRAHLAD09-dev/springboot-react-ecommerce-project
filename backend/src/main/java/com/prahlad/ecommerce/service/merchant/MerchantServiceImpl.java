package com.prahlad.ecommerce.service.merchant;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantUpdateRequest;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OTPType;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;
import com.prahlad.ecommerce.service.otp.OtpService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MerchantServiceImpl implements MerchantService 
{

    private final MerchantRepository merchantRepository;
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final NotificationService notificationService;
    
    
	// =========================
	// COMMON METHOD
	// =========================
    private Merchant getMerchantByEmail(String email) 
    {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return merchantRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
    }
	// =========================
	// GET PROFILE
	// =========================
    @Override
    public MerchantResponse getProfile(String email) 
    {

        Merchant merchant = getMerchantByEmail(email);

        return mapToDTO(merchant);
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    @Override
    public MerchantResponse updateProfile(String email, MerchantUpdateRequest request) 
    {

        Merchant merchant = getMerchantByEmail(email);

        if (request.businessName() != null) 
        {
            merchant.setBusinessName(request.businessName());
        }

        merchantRepository.save(merchant);

        return mapToDTO(merchant);
    }
    
    
	// =========================
	// DELETE ACCOUNT
	// =========================
    @Override
    public void requestDeleteAccount(String email) 
    {

        Merchant merchant = getMerchantByEmail(email);

        if (!merchant.isActive()) 
        {
            throw new BadRequestException("Account already deleted");
        }

        otpService.generateOtp(email, OTPType.DELETE_ACCOUNT);
    }
    
    @Override
    @Transactional
    public void deleteAccount(String email, String otp) 
    {

        otpService.verifyOtp(email, otp, OTPType.DELETE_ACCOUNT);

        Merchant merchant = getMerchantByEmail(email);
        
        merchant.setActive(false);
        merchant.setApproved(false);

        merchantRepository.save(merchant);

        notificationService.sendNotification(
                merchant.getUser().getEmail(),
                "Merchant Account Deleted",
                "Your merchant account has been deactivated successfully.",
                NotificationType.ACCOUNT_DELETED
        );
    }

    
    // =========================
    // DTO MAPPING
    // =========================
    private MerchantResponse mapToDTO(Merchant merchant) 
    {
        return new MerchantResponse(
                merchant.getId(),
                merchant.getBusinessName(),
                merchant.isApproved(),
                merchant.isActive()
        );
    }
}