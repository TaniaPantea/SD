package com.example.demo.services;

import com.example.demo.dtos.ChatMessageDTO;
import com.example.demo.entities.ChatMessage;
import com.example.demo.repositories.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatRepository;
    private final GeminiAIService aiService;

    public ChatService(ChatMessageRepository chatRepository, GeminiAIService aiService) {
        this.chatRepository = chatRepository;
        this.aiService = aiService;
    }

    public String processIncomingMessage(ChatMessageDTO message) {
        String content = message.getContent().toLowerCase();

        if (content.contains("salut") || content.contains("buna") || content.contains("bună")) {
            return "Bună ziua! Sunt asistentul dumneavoastră virtual. Cu ce vă pot ajuta astăzi?";
        }
        if (content.contains("consum") || content.contains("energie")) {
            return "Puteți vizualiza dinamica consumului în secțiunea 'Monitoring'. Graficul de tip 'broken line' se actualizează automat la fiecare citire.";
        }
        if (content.contains("limita") || content.contains("depasit") || content.contains("alert")) {
            return "Limitele de consum sunt setate de administrator. Dacă primiți o alertă, vă rugăm să verificați dispozitivele cu consum ridicat.";
        }
        if (content.contains("dispozitiv") || content.contains("device")) {
            return "Gestionarea dispozitivelor (adăugare/ștergere) este disponibilă doar în panoul de Administrare.";
        }
        if (content.contains("grafic") || content.contains("linia") || content.contains("broken line")) {
            return "Graficul orar utilizează puncte conectate pentru a ilustra variațiile de consum. Valorile sunt exprimate în kWh.";
        }
        if (content.contains("eroare") || content.contains("nu merge") || content.contains("bug")) {
            return "Ne pare rău pentru inconvenient. Vă rugăm să contactați echipa tehnică la support@energy-management.ro.";
        }
        if (content.contains("cont") || content.contains("setari") || content.contains("parola")) {
            return "Setările profilului pot fi accesate din colțul dreapta sus. Datele dumneavoastră sunt securizate prin protocolul JWT.";
        }
        if (content.contains("istoric") || content.contains("raport")) {
            return "Istoricul complet poate fi filtrat după dată direct în pagina de Monitorizare folosind calendarul.";
        }
        if (content.contains("program") || content.contains("orar")) {
            return "Sistemul funcționează 24/7, procesând datele primite de la simulatoarele de senzori în timp real.";
        }
        if (content.contains("multumesc") || content.contains("mersi")) {
            return "Cu plăcere! Vă stau la dispoziție pentru orice alte informații despre eficiența energetică.";
        }

        return "[AI Response] " + aiService.getAIResponse(message.getContent());
    }


    public void saveMessage(ChatMessageDTO dto) {
        ChatMessage entity = new ChatMessage();
        entity.setSenderId(dto.getSenderId());
        entity.setSenderName(dto.getSenderName());
        entity.setContent(dto.getContent());
        entity.setTimestamp(dto.getTimestamp());
        entity.setFromAdmin(dto.isFromAdmin());
        chatRepository.save(entity);
    }

}