import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HOST } from "../../commons/hosts";

let stompClient = null;

export function connectToNotifications(userId, onMessageReceived) {
    const token = localStorage.getItem('token');

    // Creăm un nou client STOMP
    stompClient = new Client({
        // Configurăm fabrica de socket-uri pentru a folosi SockJS
        webSocketFactory: () => new SockJS(HOST.backend_api + '/ws-notifications'),

        // Headers pentru conexiune (JWT)
        connectHeaders: {
            'Authorization': 'Bearer ' + token
        },

        // Debugging în consolă (opțional)
        debug: (str) => {
            console.log("STOMP Debug: " + str);
        },

        // Ce se întâmplă când conexiunea este stabilită
        onConnect: (frame) => {
            console.log('Connected: ' + frame);

            // Abonarea la notificările de monitorizare
            stompClient.subscribe(`/user/${userId}/topic/notifications`, (notification) => {
                onMessageReceived(notification.body);
            });

            // IMPORTANT: Dacă ai și chat-ul în această componentă,
            // te poți abona la el tot aici sau din chat-api.js folosind getStompClient()
        },

        // Reîncercare automată în caz de deconectare
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    // Pornim conexiunea
    stompClient.activate();
}

export function disconnectFromNotifications() {
    if (stompClient !== null) {
        stompClient.deactivate();
        console.log("Disconnected from WebSocket");
    }
    stompClient = null;
}

export function getStompClient() {
    return stompClient;
}