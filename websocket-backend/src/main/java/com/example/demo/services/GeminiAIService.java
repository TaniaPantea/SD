package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAIResponse(String userQuery) {
        String fullUrl = apiUrl + "?key=" + apiKey;

        String systemContext = "Ești un asistent inteligent pentru o aplicație de monitorizare a energiei. " +
                "Utilizatorul vede grafice orare (broken line) și primește alerte de supraconsum. " +
                "Răspunde politicos, scurt și oferă sfaturi despre economisirea energiei. " +
                "Întrebarea utilizatorului este: ";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", systemContext + userQuery)
                        ))
                )
        );

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, requestBody, Map.class);
            // Extragem textul din structura complexă a JSON-ului Gemini
            List candidates = (List) response.getBody().get("candidates");
            Map content = (Map) ((Map) candidates.get(0)).get("content");
            List parts = (List) content.get("parts");
            return (String) ((Map) parts.get(0)).get("text");
        } catch (Exception e) {
            return "[AI Error]: Momentan am dificultăți în procesarea cererii, dar te pot ajuta cu regulile de bază.";
        }
    }
}