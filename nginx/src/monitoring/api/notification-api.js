import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HOST } from "../../commons/hosts";

let stompClient = null;

export function connectToNotifications(userId, onMessageReceived) {
    const token = localStorage.getItem('token');

    stompClient = new Client({
        webSocketFactory: () => new SockJS(HOST.backend_api + '/api/ws-notifications'),
        connectHeaders: { 'Authorization': 'Bearer ' + token },

        onConnect: (frame) => {
            console.log('STOMP Connected: ' + frame);

            // 1. Abonare Notificări Overconsumption (folosește callback-ul primit din Monitoring)
            stompClient.subscribe(`/user/${userId}/topic/notifications`, (notification) => {
                onMessageReceived(notification.body);
            });

            // 2. Abonare Chat (AI & Admin) - Trimite datele printr-un eveniment global
            stompClient.subscribe(`/topic/chat.${userId}`, (msg) => {
                const chatMsg = JSON.parse(msg.body);
                window.dispatchEvent(new CustomEvent("new-chat-message", { detail: chatMsg }));
            });
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.activate();
}

export function disconnectFromNotifications() {
    if (stompClient !== null) {
        stompClient.deactivate();
    }
    stompClient = null;
}

export function getStompClient() {
    return stompClient;
}