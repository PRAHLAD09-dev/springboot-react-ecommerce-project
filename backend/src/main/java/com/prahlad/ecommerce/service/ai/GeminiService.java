package com.prahlad.ecommerce.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prahlad.ecommerce.dto.ai.AIProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService
{

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public AIProductResponse generateProductContent(
            List<String> imageUrls,
            String categoryName
    )
    {

        String prompt = """
                You are an ecommerce product expert.

                Category: %s

                Product Image URLs:
                %s

                Analyze the product and return ONLY valid JSON.

                {
                  "productName":"",
                  "aiDescription":"",
                  "specifications":[""],
                  "featureHighlights":[""],
                  "seoKeywords":[""]
                }
                """.formatted(
                categoryName,
                String.join("\n", imageUrls)
        );

        Map<String, Object> body =
                Map.of(
                        "contents",
                        List.of(
                                Map.of(
                                        "parts",
                                        List.of(
                                                Map.of(
                                                        "text",
                                                        prompt
                                                )
                                        )
                                )
                        )
                );

        try
        {
            String response =
                    webClient.post()
                            .uri(URL + "?key=" + apiKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(body)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();

            JsonNode root =
                    objectMapper.readTree(response);

            String text =
                    root.path("candidates")
                            .get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .path("text")
                            .asText();

            text = text
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            return objectMapper.readValue(
                    text,
                    AIProductResponse.class
            );
        }
        catch (Exception e)
        {
            e.printStackTrace();

            return new AIProductResponse(
                    "Unknown Product",
                    "AI description generation failed.",
                    new ArrayList<>(),
                    new ArrayList<>(),
                    new ArrayList<>()
            );
        }
    }
    
    
//    public AIProductResponse generateProductContent(
//            MultipartFile[] files,
//            String categoryName
//    )
//    {
//        try
//        {
//            if (files == null || files.length == 0)
//            {
//                throw new RuntimeException(
//                        "No image files provided"
//                );
//            }
//
//            StringBuilder imageInfo =
//                    new StringBuilder();
//
//            for (MultipartFile file : files)
//            {
//                imageInfo.append(
//                        "Image Name: "
//                ).append(
//                        file.getOriginalFilename()
//                ).append("\n");
//            }
//
//            String prompt = """
//                    You are an ecommerce product expert.
//
//                    Category: %s
//
//                    Product Images:
//
//                    %s
//
//                    Identify the product and generate ONLY valid JSON.
//
//                    {
//                      "productName":"",
//                      "aiDescription":"",
//                      "specifications":[""],
//                      "featureHighlights":[""],
//                      "seoKeywords":[""]
//                    }
//                    """.formatted(
//                    categoryName,
//                    imageInfo.toString()
//            );
//
//            return generateProductContent(
//                    List.of(prompt),
//                    categoryName
//            );
//        }
//        catch (Exception e)
//        {
//            e.printStackTrace();
//
//            return new AIProductResponse(
//                    "Unknown Product",
//                    "AI Vision failed",
//                    new ArrayList<>(),
//                    new ArrayList<>(),
//                    new ArrayList<>()
//            );
//        }
//    }
    
    public AIProductResponse generateProductContent(
            MultipartFile[] files,
            String categoryName
    )
    {
        try
        {
            if (files == null || files.length == 0)
            {
                throw new RuntimeException(
                        "No image files provided"
                );
            }

            List<Object> parts =
                    new ArrayList<>();

            parts.add(
                    Map.of(
                            "text",
                            """
                            You are an ecommerce product expert.

                            Category: %s

                            Analyze the uploaded product images.

                            Return ONLY valid JSON.

                            {
                              "productName":"",
                              "aiDescription":"",
                              "specifications":[""],
                              "featureHighlights":[""],
                              "seoKeywords":[""]
                            }
                            """.formatted(
                                    categoryName
                            )
                    )
            );
            

            for (MultipartFile file : files)
            {
            	String mimeType =
            	        file.getContentType();

            	if (mimeType == null
            	        || mimeType.isBlank()
            	        || mimeType.trim().equalsIgnoreCase("file"))
            	{
            	    String fileName =
            	            file.getOriginalFilename();

            	    if (fileName != null &&
            	            fileName.toLowerCase().endsWith(".png"))
            	    {
            	        mimeType = "image/png";
            	    }
            	    else if (fileName != null &&
            	            fileName.toLowerCase().endsWith(".webp"))
            	    {
            	        mimeType = "image/webp";
            	    }
            	    else
            	    {
            	        mimeType = "image/jpeg";
            	    }
            	}
                
            	parts.add(
            	        Map.of(
            	                "inline_data",
            	                Map.of(
            	                        "mime_type",
            	                        mimeType,
            	                        "data",
            	                        toBase64(file)
            	                )
            	        )
            	);
            }

            Map<String, Object> body =
                    Map.of(
                            "contents",
                            List.of(
                                    Map.of(
                                            "parts",
                                            parts
                                    )
                            )
                    );
            
        
            		

            		String response =
            		        webClient.post()
            		                .uri(URL + "?key=" + apiKey)
            		                .contentType(MediaType.APPLICATION_JSON)
            		                .bodyValue(body)
            		                .retrieve()
            		                .onStatus(
            		                        status -> status.isError(),
            		                        clientResponse ->
            		                                clientResponse.bodyToMono(String.class)
            		                                        .flatMap(errorBody ->
            		                                        {
            		                                           

            		                                            return reactor.core.publisher.Mono.error(
            		                                                    new RuntimeException(errorBody)
            		                                            );
            		                                        })
            		                )
            		                .bodyToMono(String.class)
            		                .block();
                           

            JsonNode root =
                    objectMapper.readTree(
                            response
                    );

            String text =
                    root.path("candidates")
                            .get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .path("text")
                            .asText();

            text = text
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            return objectMapper.readValue(
                    text,
                    AIProductResponse.class
            );
        }
        catch (Exception e)
        {
            throw new RuntimeException(
                    "AI product generation failed",
                    e
            );
        }
    }


    private String toBase64(
            MultipartFile file
    )
    {
        try
        {
            return Base64.getEncoder()
                    .encodeToString(
                            file.getBytes()
                    );
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }
}