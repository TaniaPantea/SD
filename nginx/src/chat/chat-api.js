import { getStompClient } from '../monitoring/api/notification-api';

export function sendChatMessage(userId, userName, text) {
    const client = getStompClient();

    if (client && client.active && client.connected) {
        const messagePayload = {
            senderId: userId,
            senderName: userName,
            content: text,
            timestamp: new Date().getTime(),
            isFromAdmin: false
        };

        client.publish({
            destination: "/app/chat",
            body: JSON.stringify(messagePayload)
        });
    } else {
        console.error("STOMP client nu este conectat.");
    }
}