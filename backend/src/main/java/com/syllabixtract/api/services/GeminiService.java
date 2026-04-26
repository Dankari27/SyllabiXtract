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
        // Keeping your 2.0-flash model selection
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                + geminiApiKey;

        // UPDATED PROMPT: More aggressive keyword matching
        String prompt = "You are a master academic data extractor. Read the syllabus text below and find EVERY date-related assignment, exam, quiz, and project. "
                + "Return the data STRICTLY as a single JSON object. Use YYYY-MM-DD for dates. If the year is missing, assume 2026. "
                + "Search for keywords like 'Due', 'Exam', 'Assignment', 'Project', 'Deadline', 'Test', 'Quiz'. "
                + "If no date is found for a specific item, estimate it based on the surrounding text. "
                + "Return ONLY raw JSON, no markdown backticks:\n"
                + "{\n" +
                "  \"course_code\": \"e.g. COSC 412\",\n" +
                "  \"course_name\": \"e.g. Software Engineering\",\n" +
                "  \"deadlines\": [\n" +
                "    {\n" +
                "      \"title\": \"Name of assignment or exam\",\n" +
                "      \"description\": \"Brief details or specific notes for this entry\",\n" +
                "      \"due_date\": \"YYYY-MM-DD\",\n" +
                "      \"due_time\": \"HH:mm:ss or null\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Syllabus Text:\n" + rawSyllabusText;

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> parts = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));
        requestBody.put("generationConfig", Map.of("responseMimeType", "application/json"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        JsonNode rootNode = objectMapper.readTree(response.getBody());
        String result = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        // DEBUG: See what the AI is actually thinking
        System.out.println("DEBUG: Gemini Raw JSON Output: " + result);

        return result;
    }
}