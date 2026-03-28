package com.prahlad.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Otp;
import com.prahlad.ecommerce.enums.OTPType;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> 
{
    Optional<Otp> findTopByEmailAndTypeOrderByIdDesc(String email , OTPType type );
    
    void deleteByEmailAndType(String email, OTPType type);

	long countByEmailAndTypeAndCreatedAtAfter(String email, OTPType type, LocalDateTime minusMinutes);

	void deleteByExpiryTimeBefore(LocalDateTime now);
}