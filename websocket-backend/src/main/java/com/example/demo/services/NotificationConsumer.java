package com.example.demo.services;

import com.example.demo.dtos.AlertDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "overconsumption-queue")
    public void receiveAlert(AlertDTO alert) {
        // Trimite alerta către user-ul specific prin WebSocket
        messagingTemplate.convertAndSendToUser(
                alert.getUserId().toString(),
                //caută în interiorul serverului o sesiune WebSocket care are atașat un Principal
                // al cărui nume coincide cu acel userId. asta s eface in securityconfig
                //Spring mapează automat:
                //user/{userId}/topic/notifications
                "/topic/notifications",
                "Atenție! Dispozitivul " + alert.getDeviceId() + " a depășit consumul maxim!"
        );
    }
}