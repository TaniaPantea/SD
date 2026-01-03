package com.example.demo.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Prefix pentru mesaje de la server la client
        config.setApplicationDestinationPrefixes("/app");//de la client la server
        //rice mesaj care începe cu /app trebuie să fie rutat către o metodă marcată cu @MessageMapping dintr-un @Controller
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-notifications")//URL-ul pe care frontend-ul (React) îl va apela pentru a iniția conexiunea
                //Este adresa fizică pe care browserul o apelează o singură dată la început pentru a schimba protocolul de la HTTP la WebSocket.
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}