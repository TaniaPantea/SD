import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HOST } from "../../commons/hosts";
import {toast} from "react-toastify";

let stompClient = null;

export function connectToNotifications(userId, onMessageReceived) {
    if (stompClient && stompClient.active) {
        return;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS(HOST.backend_api + '/ws-notifications'),

        onConnect: (frame) => {
            console.log('STOMP Connected: ' + frame);

            stompClient.subscribe("/topic/notifications", (msg) => {
                const alert = JSON.parse(msg.body);

                if (alert.userId === userId) {
                    toast.error(
                        `Atentie! Dispozitivul ${alert.deviceName} a depasit consumul maxim!`,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        }
                    );
                    window.dispatchEvent(new CustomEvent("reload-monitoring-data"));
                }
            });


            //  eveniment global
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


export function subscribeToAdminMessages(onMessageReceived) {
    const client = getStompClient();
    if (client && client.connected) {
        console.log("DEBUG: Adminul se abonează la /topic/admin");
        return client.subscribe("/topic/admin", (msg) => {
            console.log("DEBUG: Mesaj primit de Admin de la server:", msg.body);
            const chatMsg = JSON.parse(msg.body);
            onMessageReceived(chatMsg);
        });
    } else {
        console.error("DEBUG: Clientul STOMP nu este conectat la subscriere!");
    }
}

export function sendAdminReply(receiverId, text) {
    const client = getStompClient();
    if (client && client.connected) {
        const replyPayload = {
            receiverId: receiverId, // ID utiliz cui ii rasp, cel curent
            content: text,
            timestamp: new Date().getTime(),
            isFromAdmin: true
        };

        client.publish({
            destination: "/app/admin.reply",
            body: JSON.stringify(replyPayload)
        });
    }
}