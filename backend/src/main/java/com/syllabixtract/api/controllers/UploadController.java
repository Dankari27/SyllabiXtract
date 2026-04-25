package com.syllabixtract.api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.syllabixtract.api.services.GeminiService;
import com.syllabixtract.api.services.LlamaParseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController // This is the CORS VIP pass for the React frontend
public class UploadController {

    // TODO: Phase 2 - Inject the Services here.
    // Instead of putting all the AI code in this file, create separate
    // files (like LlamaParseService.java and GeminiService.java) and link them
    // here using Spring's @Autowired annotation so this controller can use them.
    @Autowired
    private LlamaParseService llamaParseService;

    @Autowired
    private GeminiService geminiService;

    // The Health Check Route (Used by Render to make sure the server is awake)
    @GetMapping("/")
    public Map<String, String> healthCheck() {
        return Map.of("message", "SyllabiXtract Java Backend is running!");
    }

    // The File Upload Route (Receives the PDF from the frontend)
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> handleUpload(@RequestParam("file") MultipartFile file) {
        System.out.println("Received file: " + file.getOriginalFilename());
        Map<String, Object> response = new HashMap<>();

        // Step 3: Error Handling
        // - Add a try-catch block around the AI calls. If LlamaParse or Gemini fails
        // or times out, you need to send a "status": "error" response back to React
        // so the frontend loading spinner doesn't spin forever.
        try {
            // ==========================================
            // TODO: THE AI PIPELINE GOES HERE
            // ==========================================

            // Step 1: LlamaParse Integration
            // - Convert the incoming "MultipartFile" into a format LlamaParse accepts
            // (which will probably be ajava.io.File).
            // - Send the file to the LlamaParse API using the LLAMA_CLOUD_API_KEY.
            // - Wait for the response and save the extracted text to a String variable.
            // Example: String rawSyllabusText = llamaParseService.parseDocument(file);
            System.out.println("Sending to LlamaParse...");
            String rawSyllabusText = llamaParseService.parseDocument(file);

            // Step 2: Gemini Integration
            // - Take the "rawSyllabusText" and combine it with the custom prompt for Gemini
            // (e.g., "Find all assignments and dates in this text and return as JSON").
            // - Send that combined string to the Gemini API using your GEMINI_API_KEY.
            // - Wait for the response and save the structured JSON to a variable.
            // Example: String structuredJsonData =
            // geminiService.extractSchedule(rawSyllabusText);
            System.out.println("Sending to Gemini...");
            String structuredJsonData = geminiService.extractScheduleAsJson(rawSyllabusText);

            // ==========================================
            // CURRENT MOCK RESPONSE (Replace later)
            // ==========================================

            // TODO: Once the AI pipeline is working, delete this mock data block.
            // Put the real 'structuredJsonData' from Gemini into
            // the response map later when everything is set up so the frontend can render
            // the actual schedule.

            ObjectMapper mapper = new ObjectMapper();
            Object scheduleData = mapper.readValue(structuredJsonData, Object.class);

            response.put("status", "success");
            response.put("filename", file.getOriginalFilename());
            response.put("message", "File processed successfully by the AI Pipeline!");
            response.put("events", scheduleData); // Replaced mock_events with the real data

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to process document: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}