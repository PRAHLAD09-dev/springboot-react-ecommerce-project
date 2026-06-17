package com.prahlad.ecommerce.dto.herobanner;

import org.springframework.web.multipart.MultipartFile;

public record HeroBannerRequest(

        Long productId,

        Integer position,

        MultipartFile image

) {}