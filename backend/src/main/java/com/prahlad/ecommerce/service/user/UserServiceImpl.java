package com.prahlad.ecommerce.service.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.dto.user.UserUpdateRequest;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OTPType;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;
import com.prahlad.ecommerce.service.otp.OtpService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService 
{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final NotificationService notificationService;


    // =========================
    // COMMON METHOD
    // =========================
    private User getUserByEmail(String email) 
    {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // =========================
    // GET PROFILE
    // =========================
    @Override
    public UserResponse getProfile(String email) 
    {
        return mapToDTO(getUserByEmail(email));
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    @Override
    public UserResponse updateProfile(String email, UserUpdateRequest request) 
    {

        User user = getUserByEmail(email);

        user.setName(request.name().trim());

        userRepository.save(user);

        return mapToDTO(user);
    }

    // =========================
    // DELETE ACCOUNT
    // =========================
    
	@Override
	public void requestDeleteAccount(String email) 
	{

		User user = getUserByEmail(email);

		if (!user.isActive()) 
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

        User user = getUserByEmail(email);

        user.setActive(false);

        userRepository.save(user);

        notificationService.sendNotification(
                email,
                "Account Deleted ",
                "Your account has been successfully deleted. If this wasn't you, contact support immediately.",
                NotificationType.ACCOUNT_DELETED
        );
    
    }
    

    // =========================
    // CHANGE PASSWORD (NO OTP)
    // =========================
    @Override
    public String changePassword(
            String email,
            String oldPassword,
            String newPassword)
    {

        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(
                oldPassword,
                user.getPassword()))
        {
            throw new BadRequestException(
                    "Old password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()))
        {
            throw new BadRequestException(
                    "New password must be different"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        notificationService.sendNotification(
                email,
                "Password Changed",
                "Your account password was changed successfully.",
                NotificationType.PASSWORD_CHANGED
        );

        return "Password changed successfully";
    }
   
    // =========================
    // DTO MAPPING
    // =========================
    private UserResponse mapToDTO(User user) 
    {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

}