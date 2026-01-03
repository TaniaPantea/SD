package com.example.demo.repositories;

import com.example.demo.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findBySenderIdOrderByTimestampAsc(UUID senderId);
}