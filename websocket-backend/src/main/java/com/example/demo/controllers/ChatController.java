package com.example.demo.controllers;

import com.example.demo.dtos.ChatMessageDTO;
import com.example.demo.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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

        String autoResponse = chatService.processIncomingMessage(chatMessage);

        UUID senderId = autoResponse.startsWith("[AI Response]") ? AI_ID : BOT_ID;
        String senderName = autoResponse.startsWith("[AI Response]") ? "Smart-AI" : "System-Bot";

        String cleanResponse = autoResponse.replace("[AI Response] ", "");

        ChatMessageDTO responseDTO = new ChatMessageDTO(
                senderId,
                senderName,
                cleanResponse,
                true
        );

        messagingTemplate.convertAndSendToUser(
                chatMessage.getSenderId().toString(),
                "/topic/chat",
                responseDTO
        );
    }
}