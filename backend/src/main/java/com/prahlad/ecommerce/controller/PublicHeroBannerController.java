package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.herobanner.HeroBannerResponse;
import com.prahlad.ecommerce.service.herobanner.HeroBannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hero-banners")
@RequiredArgsConstructor
public class PublicHeroBannerController
{

    private final HeroBannerService heroBannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HeroBannerResponse>>>
    getActiveBanners()
    {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Hero banners fetched successfully",
                        heroBannerService.getActiveBanners()
                )
        );
    }
}