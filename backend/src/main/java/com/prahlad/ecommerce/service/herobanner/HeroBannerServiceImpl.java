package com.prahlad.ecommerce.service.herobanner;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.prahlad.ecommerce.dto.herobanner.HeroBannerRequest;
import com.prahlad.ecommerce.dto.herobanner.HeroBannerResponse;
import com.prahlad.ecommerce.entity.HeroBanner;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.HeroBannerRepository;
import com.prahlad.ecommerce.repository.ProductRepository;



import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HeroBannerServiceImpl implements HeroBannerService
{

    private final HeroBannerRepository heroBannerRepository;
    private final ProductRepository productRepository;
    private final Cloudinary cloudinary;
    
    @Override
    public List<HeroBannerResponse> getActiveBanners()
    {

        return heroBannerRepository
                .findByActiveTrueOrderByPositionAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<HeroBannerResponse> getAllBanners()
    {

        return heroBannerRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public HeroBannerResponse createBanner(
            HeroBannerRequest request
    )
    {
    	
    	if(heroBannerRepository.existsByPosition(request.position()))
    	{
    	    throw new RuntimeException(
    	        "Position already occupied"
    	    );
    	}

        Product product =
                productRepository
                        .findById(request.productId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                        );

        try
        {

            Map uploadResult =
                    cloudinary.uploader().upload(
                            request.image().getBytes(),
                            ObjectUtils.emptyMap()
                    );

            String imageUrl =
                    uploadResult
                            .get("secure_url")
                            .toString();

            String publicId =
                    uploadResult
                            .get("public_id")
                            .toString();

            HeroBanner banner =
                    HeroBanner.builder()
                            .product(product)
                            .imageUrl(imageUrl)
                            .publicId(publicId)
                            .position(request.position())
                            .active(false)
                            .build();

            return mapToResponse(
                    heroBannerRepository.save(
                            banner
                    )
            );

        }
        catch (Exception e)
        {

            throw new RuntimeException(
                    "Banner upload failed",
                    e
            );

        }

    }

    @Override
    public void removeBanner(
            Long bannerId
    )
    {

        HeroBanner banner =
                heroBannerRepository
                        .findById(bannerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hero banner not found"
                                )
                        );

        try
        {

            cloudinary.uploader().destroy(
                    banner.getPublicId(),
                    ObjectUtils.emptyMap()
            );

        }
        catch (Exception e)
        {

            throw new RuntimeException(
                    "Cloudinary delete failed",
                    e
            );

        }

        heroBannerRepository.delete(
                banner
        );

    }
    
    @Override
    public HeroBannerResponse publishBanner(
            Long bannerId
    )
    {

        HeroBanner banner =
                heroBannerRepository
                        .findById(bannerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hero banner not found"
                                )
                        );

        banner.setActive(true);

        return mapToResponse(
                heroBannerRepository.save(
                        banner
                )
        );

    }

    private HeroBannerResponse mapToResponse(
            HeroBanner banner
    )
    {

       return new HeroBannerResponse(

                banner.getId(),

                banner.getProduct().getId(),

                banner.getProduct().getName(),

                banner.getImageUrl(),

                banner.getPosition(),

                banner.isActive()
        );
    }
}