package com.example.demo.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.synchronization}")
    private String synchronizationExchange;

    private static final String USER_SYNC_QUEUE = "user-sync-demo-queue";

    @Bean
    public Exchange synchronizationExchange() {
        return ExchangeBuilder.topicExchange(synchronizationExchange).durable(true).build();
    }

    @Bean
    public Queue userSyncQueue() {
        return new Queue(USER_SYNC_QUEUE, true);
    }

    @Bean
    public Binding bindingUserSync() {
        return BindingBuilder
                .bind(userSyncQueue())
                .to(synchronizationExchange())
                .with("user.#")
                .noargs();
    }

    @Bean
    public SimpleMessageListenerContainer messageListenerContainer(ConnectionFactory connectionFactory) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        container.setFailedDeclarationRetryInterval(5000L);

        return container;
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}