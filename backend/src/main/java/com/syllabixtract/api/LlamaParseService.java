package com.syllabixtract.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LlamaParseService {

    @Value("${LLAMA_CLOUD_API_KEY}")
    private String llamaApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String parseDocument(MultipartFile file) throws Exception {
        // Step 1: Upload the File
        String uploadUrl = "https://api.cloud.llamaindex.ai/api/parsing/upload";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(llamaApiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileAsResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> uploadResponse = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

        JsonNode uploadNode = objectMapper.readTree(uploadResponse.getBody());
        String jobId = uploadNode.get("id").asText();

        // Step 2: Poll for Completion (Check every 2 seconds)
        String statusUrl = "https://api.cloud.llamaindex.ai/api/parsing/job/" + jobId;
        HttpEntity<Void> getEntity = new HttpEntity<>(headers);

        boolean isDone = false;
        while (!isDone) {
            Thread.sleep(2000);
            ResponseEntity<String> statusResponse = restTemplate.exchange(statusUrl, HttpMethod.GET, getEntity,
                    String.class);
            JsonNode statusNode = objectMapper.readTree(statusResponse.getBody());
            String status = statusNode.get("status").asText();

            if (status.equals("SUCCESS")) {
                isDone = true;
            } else if (status.equals("ERROR")) {
                throw new Exception("LlamaParse failed to read the document.");
            }
        }

        // Step 3: Download the resulting text
        String resultUrl = "https://api.cloud.llamaindex.ai/api/parsing/job/" + jobId + "/result/markdown";
        ResponseEntity<String> resultResponse = restTemplate.exchange(resultUrl, HttpMethod.GET, getEntity,
                String.class);

        JsonNode resultNode = objectMapper.readTree(resultResponse.getBody());
        return resultNode.get("markdown").asText();
    }
}