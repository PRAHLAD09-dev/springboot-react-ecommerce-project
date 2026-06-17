package com.prahlad.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prahlad.ecommerce.entity.HeroBanner;

public interface HeroBannerRepository extends JpaRepository<HeroBanner, Long> 
{

    List<HeroBanner> findByActiveTrueOrderByPositionAsc();

    boolean existsByPosition(Integer position);
}