package com.prahlad.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Merchant;


@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> 
{
    Optional<Merchant> findByEmail(String email);
}