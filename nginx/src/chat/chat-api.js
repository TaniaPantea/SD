import { getStompClient } from '../monitoring/api/notification-api';

export function sendChatMessage(userId, userName, text) {
    const client = getStompClient();
    const token = localStorage.getItem('token'); // Opțional, poți pune token și aici dacă ai securizat și rutele de SEND

    if (client && client.active && client.connected) {
        const messagePayload = {
            senderId: userId,
            senderName: userName,
            content: text,
            timestamp: new Date().getTime(),
            isFromAdmin: false
        };

        client.publish({
            destination: "/app/chat", // CORECT: Fără /api aici, Spring se ocupă
            headers: { 'Authorization': 'Bearer ' + token }, // Trimitem token-ul și la publish
            body: JSON.stringify(messagePayload)
        });
    } else {
        console.error("STOMP client nu este conectat.");
    }
}