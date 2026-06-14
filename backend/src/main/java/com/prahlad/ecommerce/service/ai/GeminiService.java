package com.prahlad.ecommerce.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prahlad.ecommerce.dto.ai.AIProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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
}