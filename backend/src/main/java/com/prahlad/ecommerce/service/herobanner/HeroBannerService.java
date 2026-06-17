package com.prahlad.ecommerce.service.herobanner;

import java.util.List;

import com.prahlad.ecommerce.dto.herobanner.HeroBannerRequest;
import com.prahlad.ecommerce.dto.herobanner.HeroBannerResponse;


public interface HeroBannerService
{
    List<HeroBannerResponse> getActiveBanners();

    List<HeroBannerResponse> getAllBanners();

    HeroBannerResponse createBanner( HeroBannerRequest request );

    HeroBannerResponse publishBanner( Long bannerId );

    void removeBanner(  Long bannerId);
}