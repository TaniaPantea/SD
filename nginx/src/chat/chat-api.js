import { getStompClient } from '../monitoring/api/notification-api';

export function sendChatMessage(userId, userName, text) {
    const client = getStompClient();

    // În @stomp/stompjs folosim 'active' și verificăm dacă există brokerul
    if (client && client.active) {
        const messagePayload = {
            senderId: userId,
            senderName: userName,
            content: text,
            timestamp: new Date().getTime(),
            fromAdmin: false
        };

        client.publish({
            destination: "/app/chat", // Asigură-te că în Java ai @MessageMapping("/chat")
            body: JSON.stringify(messagePayload)
        });
    } else {
        console.error("STOMP client is not active. Cannot send message.");
    }
}

export function subscribeToChat(userId, onMessageReceived) {
    const client = getStompClient();

    if (client && client.active) {
        // Metoda subscribe rămâne similară, dar returnează un obiect de dezabonare
        return client.subscribe(`/user/${userId}/topic/chat`, (msg) => {
            if (msg.body) {
                onMessageReceived(JSON.parse(msg.body));
            }
        });
    }
    return null;
}