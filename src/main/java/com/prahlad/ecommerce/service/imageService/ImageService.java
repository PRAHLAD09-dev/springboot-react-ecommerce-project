package com.prahlad.ecommerce.service.imageService;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.prahlad.ecommerce.exception.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageService 
{

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException 
    {

        if (file == null || file.isEmpty()) 
        {
            throw new BadRequestException("Image file is required");
        }

        Map<?, ?> uploadResult = cloudinary.uploader()
                .upload(file.getBytes(), ObjectUtils.emptyMap());

        return uploadResult.get("secure_url").toString();
    }
}