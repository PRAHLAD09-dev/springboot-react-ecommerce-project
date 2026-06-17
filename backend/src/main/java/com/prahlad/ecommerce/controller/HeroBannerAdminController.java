package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.herobanner.HeroBannerRequest;
import com.prahlad.ecommerce.dto.herobanner.HeroBannerResponse;
import com.prahlad.ecommerce.service.herobanner.HeroBannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/hero-banners")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class HeroBannerAdminController
{

    private final HeroBannerService heroBannerService;

    // ================= GET ALL BANNERS =================

    @GetMapping
    public ResponseEntity<ApiResponse<List<HeroBannerResponse>>>
    getAllBanners()
    {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Hero banners fetched successfully",
                        heroBannerService.getAllBanners()
                )
        );
    }

    // ================= CREATE BANNER =================

    @PostMapping(
            consumes =
            MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<HeroBannerResponse>>
    createBanner(
            @ModelAttribute HeroBannerRequest request
    )
    {

        HeroBannerResponse response =
                heroBannerService.createBanner(
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Hero banner created successfully",
                        response
                )
        );

    }
    
    
    @PutMapping("/{bannerId}/publish")
    public ResponseEntity<ApiResponse<HeroBannerResponse>>
    publishBanner(
            @PathVariable Long bannerId
    )
    {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Banner published successfully",
                        heroBannerService.publishBanner(
                                bannerId
                        )
                )
        );

    }

    // ================= DELETE BANNER =================

    @DeleteMapping("/{bannerId}")
    public ResponseEntity<ApiResponse<String>>
    removeBanner(
            @PathVariable Long bannerId
    )
    {

        heroBannerService.removeBanner(
                bannerId
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Hero banner removed successfully",
                        "Deleted"
                )
        );
    }
}