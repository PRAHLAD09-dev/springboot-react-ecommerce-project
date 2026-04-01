package com.prahlad.ecommerce.service.auth;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.auth.AuthResponse;
import com.prahlad.ecommerce.dto.auth.LoginRequest;
import com.prahlad.ecommerce.dto.auth.ResetPasswordRequest;
import com.prahlad.ecommerce.dto.merchant.MerchantRegisterRequest;
import com.prahlad.ecommerce.dto.otp.OtpRequest;
import com.prahlad.ecommerce.dto.user.UserRegisterRequest;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Otp;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OTPType;
import com.prahlad.ecommerce.enums.Role;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.OtpRepository;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.security.JwtUtil;
import com.prahlad.ecommerce.service.notification.NotificationService;
import com.prahlad.ecommerce.service.otp.EmailService;
import com.prahlad.ecommerce.service.otp.OtpService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService 
{

    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRepository otpRepository;
    private final OtpService otpService;
    private final NotificationService notificationService;
    private final EmailService emailService;

    
    @Override
    public AuthResponse registerUser(UserRegisterRequest request) 
    {

        Optional<User> userOptional = userRepository.findByEmail(request.email());

        if (userOptional.isPresent()) 
        {

            User existingUser = userOptional.get();

            if (existingUser.isActive()) 
            {
                throw new BadRequestException("Email already exists");
            }

            existingUser.setActive(true);
            existingUser.setPassword(passwordEncoder.encode(request.password()));
            existingUser.setName(request.name());

            userRepository.save(existingUser);

            notificationService.sendNotification(
                    existingUser.getEmail(),
                    "Account Restored",
                    "Your account has been successfully re-activated.",
                    NotificationType.REGISTER_SUCCESS
            );

            return new AuthResponse(
                    "Account restored successfully",
                    existingUser.getEmail(),
                    existingUser.getRole().name(),
                    null
            );
        }

        // ================= NEW USER =================
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .active(true)
                .build();

        userRepository.save(user);

        String plainMessage = "Your account has been successfully created.";

        String htmlMessage = """
        <html>
        <body>
        <h2>Welcome to Ecommerce App </h2>
        <p>Your account has been successfully created.</p>
        <br>
        <a href="https://ecommerce-backend-o9vh.onrender.com/swagger-ui/index.html#/">
            <button style="padding:10px;background:green;color:white;border:none;">
                Start Shopping
            </button>
        </a>
        <br><br>
        Thanks,<br>
        Ecommerce Team
        </body>
        </html>
        """;

        notificationService.sendNotification(
                user.getEmail(),
                "Welcome to Ecommerce App",
                plainMessage,
                NotificationType.REGISTER_SUCCESS
        );

        emailService.sendHtmlMail(
                user.getEmail(),
                "Welcome to Ecommerce App",
                htmlMessage
        );

        return new AuthResponse(
                "User registered successfully",
                user.getEmail(),
                user.getRole().name(),
                null
        );
    }
    
    @Override
    public AuthResponse registerMerchant(MerchantRegisterRequest request) 
    {

        Optional<Merchant> merchantOptional = merchantRepository.findByEmail(request.email());

        if (merchantOptional.isPresent()) 
        {

            Merchant existingMerchant = merchantOptional.get();

            if (existingMerchant.isActive()) 
            {
                throw new BadRequestException("Email already exists");
            }

            existingMerchant.setActive(true);
            existingMerchant.setPassword(passwordEncoder.encode(request.password()));
            existingMerchant.setBusinessName(request.businessName());
            existingMerchant.setApproved(false); 

            merchantRepository.save(existingMerchant);

            notificationService.sendNotification(
                    existingMerchant.getEmail(),
                    "Account Restored",
                    "Your merchant account has been re-activated. Awaiting admin approval.",
                    NotificationType.REGISTER_SUCCESS
            );

            return new AuthResponse(
                    "Merchant account restored. Awaiting admin approval.",
                    existingMerchant.getEmail(),
                    existingMerchant.getRole().name(),
                    null
            );
        }

        // ================= NEW MERCHANT =================
        Merchant merchant = Merchant.builder()
                .businessName(request.businessName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.MERCHANT)
                .approved(false)
                .active(true) 
                .build();

        merchantRepository.save(merchant);

        String message = """
            Hi,

            Welcome to Ecommerce App 

            Your account has been successfully created.

            Your merchant account is created. Awaiting admin approval.

            Thanks,
            Ecommerce Team
            """;

        notificationService.sendNotification(
                merchant.getEmail(),
                "Welcome to Ecommerce App",
                message,
                NotificationType.REGISTER_SUCCESS
        );

        return new AuthResponse(
                "Merchant registered successfully. Awaiting admin approval.",
                merchant.getEmail(),
                merchant.getRole().name(),
                null
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) 
    {

        // ================= USER LOGIN =================
        User user = userRepository.findByEmail(request.email()).orElse(null);

        if (user != null) 
        {

            if (!user.isActive()) 
            {
                throw new RuntimeException("Account is deleted");
            }

            if (!passwordEncoder.matches(request.password(), user.getPassword())) 
            {
                throw new RuntimeException("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user);

            return new AuthResponse(
                    "Login successful",
                    user.getEmail(),
                    user.getRole().name(),
                    token
            );
        }

        // ================= MERCHANT LOGIN =================
        Merchant merchant = merchantRepository.findByEmail(request.email()).orElse(null);

        if (merchant != null) 
        {

            if (!merchant.isActive()) 
            {
                throw new RuntimeException("Account is deleted");
            }

            if (!passwordEncoder.matches(request.password(), merchant.getPassword())) 
            {
                throw new RuntimeException("Invalid credentials");
            }

            if (!merchant.isApproved()) 
            {
                return new AuthResponse(
                        "Merchant not approved yet",
                        merchant.getEmail(),
                        merchant.getRole().name(),
                        null
                );
            }

            String token = jwtUtil.generateToken(merchant);

            return new AuthResponse(
                    "Login successful",
                    merchant.getEmail(),
                    merchant.getRole().name(),
                    token
            );
        }

        throw new RuntimeException("Invalid credentials");
    }
    

    @Override
    public void sendForgotPasswordOtp(OtpRequest request)
    {
        String email = request.email();

		boolean exists = userRepository.existsByEmail(email) || merchantRepository.existsByEmail(email);

        if (!exists) 
        {
            return;
        }

        Optional<Otp> optionalOtp = otpRepository.findTopByEmailAndTypeOrderByIdDesc(email, OTPType.FORGOT_PASSWORD);

        if (optionalOtp.isPresent()) 
        {
            Otp otp = optionalOtp.get();

            if (otp.getExpiryTime().isAfter(LocalDateTime.now())) 
            {

                if (otp.getAttempts() >= 3) 
                {
                    return; 
                }

                otp.setAttempts(otp.getAttempts() + 1);
                otpRepository.save(otp);

                emailService.sendOtp(email, otp.getOtp());

                return;
            }
        }

        otpService.generateOtp(email, OTPType.FORGOT_PASSWORD);
    }
    
	@Override
	public void resetPassword(ResetPasswordRequest request) 
	{

		otpService.verifyOtp(request.email(), request.otp(), OTPType.FORGOT_PASSWORD);

		Optional<User> userOpt = userRepository.findByEmail(request.email());

		if (userOpt.isPresent()) 
		{
			User user = userOpt.get();
			user.setPassword(passwordEncoder.encode(request.newPassword()));
			userRepository.save(user);
			return;
		}

		Optional<Merchant> merchantOpt = merchantRepository.findByEmail(request.email());

		if (merchantOpt.isPresent()) 
		{
			Merchant merchant = merchantOpt.get();
			merchant.setPassword(passwordEncoder.encode(request.newPassword()));
			merchantRepository.save(merchant);
			return;
		}

		throw new ResourceNotFoundException("Invalid credentials");
	}
}