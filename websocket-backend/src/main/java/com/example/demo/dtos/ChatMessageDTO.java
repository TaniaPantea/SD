package com.example.demo.dtos;

import java.util.UUID;

public class ChatMessageDTO {
    private UUID senderId;
    private String senderName;
    private String content;
    private long timestamp;
    private boolean isFromAdmin;
    private UUID receiverId;//pt cand adminul trm msj

    public ChatMessageDTO() {
        this.timestamp = System.currentTimeMillis();
    }

    public ChatMessageDTO(UUID senderId, String senderName, String content, boolean isFromAdmin, UUID receiverId) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.isFromAdmin = isFromAdmin;
        this.timestamp = System.currentTimeMillis();
        this.receiverId = receiverId;
    }

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public boolean isFromAdmin() { return isFromAdmin; }
    public void setFromAdmin(boolean fromAdmin) { isFromAdmin = fromAdmin; }

    public UUID getReceiverId() { return receiverId; }
    public void setReceiverId(UUID receiverId) { this.receiverId = receiverId; }
}