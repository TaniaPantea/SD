import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HOST } from "../../commons/hosts";
import {toast} from "react-toastify";

let stompClient = null;

export function connectToNotifications(userId, onMessageReceived) {
    const token = localStorage.getItem('token');

    stompClient = new Client({
        webSocketFactory: () => new SockJS(HOST.backend_api + '/ws-notifications'),

        onConnect: (frame) => {
            console.log('STOMP Connected: ' + frame);

            stompClient.subscribe("/topic/notifications", (msg) => {
                const alert = JSON.parse(msg.body);

                if (alert.userId === userId) {
                    toast.error(
                        `Atenție! Dispozitivul ${alert.deviceName} a depășit consumul maxim!`,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        }
                    );
                }
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