package com.example.demo.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.measurement}")
    private String measurementQueueName;

    @Bean
    public Queue measurementQueue() {
        return new Queue(measurementQueueName, true);
    }


    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }

    //metoda cu containerul are dublu sens, reincearca la pornire conexiunea cu rabbitmq pana merge
    // si cea de a asculta cozile
    @Bean
    public SimpleMessageListenerContainer messageListenerContainer(@Autowired ConnectionFactory connectionFactory) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        container.setFailedDeclarationRetryInterval(5000L);

        return container;
    }

    //PENTRU RELATIA CU DEVICE:
    @Value("${rabbitmq.exchange.synchronization}")
    private String synchronizationExchangeName;

    private static final String DEVICE_SYNC_MONITORING_QUEUE = "device-sync-monitoring-queue";

    @Bean
    public Exchange synchronizationExchange() {
        return ExchangeBuilder
                .topicExchange(synchronizationExchangeName)
                .durable(true)
                .build();
    }

    @Bean
    public Queue deviceSyncMonitoringQueue() {
        return new Queue(DEVICE_SYNC_MONITORING_QUEUE, true);
    }

    @Bean
    public Binding bindingDeviceSyncMonitoring(Exchange synchronizationExchange) {
        return BindingBuilder
                .bind(deviceSyncMonitoringQueue())
                .to(synchronizationExchange)
                .with("device.#")
                .noargs();
    }

}