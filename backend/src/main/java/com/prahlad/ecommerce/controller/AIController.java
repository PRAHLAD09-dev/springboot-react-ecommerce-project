package com.prahlad.ecommerce.controller;

import com.prahlad.ecommerce.service.ai.GeminiService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth/ai")
@RequiredArgsConstructor
public class AIController
{

    private final GeminiService geminiService;

//    @GetMapping("/test")
//    public String test()
//    {
//        return geminiService.generateContent(
//                "Tell me about iPhone 16 in 50 words"
//        );
//    }
    
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String test(
            @RequestPart("data") String data,
            @RequestPart("files") MultipartFile[] files
    )
    {
        return data;
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "AI Controller Working";
    }
}