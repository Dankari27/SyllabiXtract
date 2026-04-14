package com.syllabixtract.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String extractScheduleAsJson(String rawSyllabusText) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + geminiApiKey;

        // 1. Write the Prompt
        String prompt = "You are a highly accurate academic assistant. Read the following syllabus text and extract every assignment, quiz, exam, and project. "
                +
                "Return the data as a strict JSON array of objects with 'title' and 'date' (Format: YYYY-MM-DD). Do not include any other text or markdown.\n\n"
                +
                "Syllabus Text:\n" + rawSyllabusText;

        // 2. Build the Gemini JSON Request
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> parts = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        // Force pure JSON response
        requestBody.put("generationConfig", Map.of("responseMimeType", "application/json"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // 3. Send to Google
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        // 4. Parse the response to get the actual text
        JsonNode rootNode = objectMapper.readTree(response.getBody());
        return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    }
}