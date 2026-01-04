package com.example.demo.controllers;

import com.example.demo.dtos.ChatMessageDTO;
import com.example.demo.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    // Definim ID-uri fixe pentru sistem
    private static final UUID BOT_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");
    private static final UUID AI_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessageDTO chatMessage) {
        chatService.saveMessage(chatMessage);
        //messagingTemplate.convertAndSend("/topic/admin", chatMessage);

        System.out.println("Procesez mesaj de la: " + chatMessage.getSenderId());
        String autoResponse = chatService.processIncomingMessage(chatMessage);
        System.out.println("Raspuns generat: " + autoResponse);

        UUID senderId = autoResponse.startsWith("[AI Response]") ? AI_ID : BOT_ID;
        String senderName = autoResponse.startsWith("[AI Response]") ? "Smart-AI" : "System-Bot";

        String cleanResponse = autoResponse.replace("[AI Response] ", "");

        ChatMessageDTO responseDTO = new ChatMessageDTO(
                senderId,
                senderName,
                cleanResponse,
                true
        );

        messagingTemplate.convertAndSend("/topic/chat." + chatMessage.getSenderId(), responseDTO);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable UUID userId) {
        return ResponseEntity.ok(chatService.getMessagesForUser(userId));
    }
}