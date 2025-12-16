package com.example.demo.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.synchronization}")
    private String synchronizationExchange;

    private static final String USER_SYNC_DEVICE_QUEUE = "user-sync-device-queue";


    @Bean
    public SimpleMessageListenerContainer messageListenerContainer(@Autowired ConnectionFactory connectionFactory) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        container.setFailedDeclarationRetryInterval(5000L);

        return container;
    }

    @Bean
    public Exchange synchronizationExchange() {
        return ExchangeBuilder.topicExchange(synchronizationExchange).durable(true).build();
    }

    @Bean
    public Queue userSyncDeviceQueue() {
        return new Queue(USER_SYNC_DEVICE_QUEUE, true);
    }

    @Bean
    public Binding bindingUserSyncDevice() {
        return BindingBuilder
                .bind(userSyncDeviceQueue())
                .to(synchronizationExchange())
                .with("user.synced")
                .noargs();
    }
}