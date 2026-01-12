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
        // Debug: Ar trebui să vezi primele 5 caractere în consolă acum
        System.out.println("DEBUG: Folosesc cheia: " + (apiKey != null && !apiKey.isEmpty() ? apiKey.substring(0, 5) + "..." : "NULL"));

        System.out.println("URL: " + apiUrl);
        System.out.println("Key starts with: " + (apiKey != null ? apiKey.substring(0, 5) : "NULL"));

        String fullUrl = apiUrl + "?key=" + apiKey;

        String systemContext = "(pentru context este un asistent ai pentru o aplicatie de monitorizare a energieie electrice" +
                ",in care un utilizator simplu vede urmatoarele pagini: " +
                "pagina de useri unde se pot vizualiza toti utilizatori, " +
                "pagina de dispozitive in care se pot vizualiza toate dispozitivele" +
                "si pagina de monitorizare unde se pot vedea grafice despre dispozitivele tale si grafice care indica consumul acestora)";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", systemContext + userQuery)
                        ))
                )
        );

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, requestBody, Map.class);

            // Parsare sigură a JSON-ului complex Gemini
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List candidates = (List) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    List parts = (List) content.get("parts");
                    return (String) ((Map) parts.get(0)).get("text");
                }
            }
            return "[AI Error]: Răspuns neașteptat de la API.";

        } catch (Exception e) {
            System.err.println("EROARE APEL GEMINI: " + e.getMessage());
            return "[AI Error]: Momentan nu pot procesa cererea Gemini.";
        }
    }
}