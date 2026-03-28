package com.prahlad.ecommerce.service.otp;

import java.time.LocalDateTime;
import java.security.SecureRandom;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Otp;
import com.prahlad.ecommerce.enums.OTPType;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.OtpRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpService 
{

	private final OtpRepository otpRepository;
	private final EmailService emailService;
	private final PasswordEncoder passwordEncoder;

	public void generateOtp(String email, OTPType type) 
	{

		long count = otpRepository.countByEmailAndTypeAndCreatedAtAfter(email, type,
				LocalDateTime.now().minusMinutes(5));

		if (count >= 3) 
		{
			throw new BadRequestException("Too many OTP requests. Try later.");
		}

		otpRepository.deleteByEmailAndType(email, type);

		SecureRandom random = new SecureRandom();
		String otp = String.valueOf(random.nextInt(900000) + 100000);

		String hashedOtp = passwordEncoder.encode(otp);

		Otp entity = new Otp();
		entity.setEmail(email);
		entity.setOtp(hashedOtp);
		entity.setType(type);
		entity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
		entity.setAttempts(0);

		otpRepository.save(entity);

		emailService.sendOtp(email, otp);
	}

	public void verifyOtp(String email, String otpInput, OTPType type) 
	{

		Otp otp = otpRepository.findTopByEmailAndTypeOrderByIdDesc(email, type)
				.orElseThrow(() -> new ResourceNotFoundException("OTP not found"));

		if (otp.getAttempts() >= 5) 
		{
			throw new BadRequestException("Too many attempts. Try later.");
		}

		if (otp.getExpiryTime().isBefore(LocalDateTime.now())) 
		{
			throw new BadRequestException("OTP expired");
		}

		if (!passwordEncoder.matches(otpInput, otp.getOtp())) 
		{
			otp.setAttempts(otp.getAttempts() + 1);
			otpRepository.save(otp);
			throw new BadRequestException("Invalid OTP");
		}

		otpRepository.delete(otp);
	}
}