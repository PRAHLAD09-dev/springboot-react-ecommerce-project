package com.prahlad.ecommerce.service.otp;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.repository.OtpRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@EnableScheduling
@Transactional
public class OtpCleanupService 
{

	private final OtpRepository otpRepository;
	
    @Scheduled(cron = "0 */5 * * * *")
    public void deleteExpiredOtps() {
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
    }
}