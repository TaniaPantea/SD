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
    @RabbitListener(queues = "overconsumption-queue")
    public void receiveAlert(AlertDTO alert) {

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                alert
        );
    }

}