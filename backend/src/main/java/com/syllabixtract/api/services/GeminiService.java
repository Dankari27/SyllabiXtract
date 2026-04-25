package com.syllabixtract.api.services;

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

        // 1. Write the Prompt (Adjust this prompt if we want llama parse to extract
        // more stuff in a specific format)
        String prompt = "You are an expert academic data extractor. Read the following syllabus text and extract the key information. "
                +
                "Return the data STRICTLY as a single JSON object matching this exact structure structure. Do not include any markdown backticks:\n"
                +
                "{\n" +
                "  \"courseName\": \"Extract the course code and name (e.g., COSC 412 Software Engineering)\",\n" +
                "  \"professor\": \"Extract the instructor's name\",\n" +
                "  \"officeHours\": \"Extract the office hours and location\",\n" +
                "  \"gradingScale\": [\n" +
                "    {\"grade\": \"A\", \"range\": \"95-100\"}\n" + // Instructs it to make an array of the grading
                                                                    // scale
                "  ],\n" +
                "  \"schedule\": [\n" +
                "    {\"title\": \"Event name\", \"date\": \"YYYY-MM-DD\", \"type\": \"Categorize as Exam, Assignment, Project, or Other\"}\n"
                +
                "  ]\n" +
                "}\n\n" +
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