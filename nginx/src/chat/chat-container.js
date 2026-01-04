import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { getUserId, getUserName } from '../commons/auth/jwt-utils';
import { sendChatMessage } from './chat-api'; // Asigură-te că aici ai și connect/disconnect
import axios from 'axios'; // <--- ADĂUGAT: Trebuie să imporți axios pentru fetchHistory

function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);

    const userId = getUserId();
    const userName = getUserName() || "User";
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchHistory = () => {
            // Folosim fetch care returnează un Promise
            fetch(`http://localhost/api/chat/history/${userId}`)
                .then(response => {
                    // Verificăm dacă statusul e OK și dacă e JSON
                    const contentType = response.headers.get("content-type");
                    if (!response.ok) {
                        throw new Error(`Serverul a răspuns cu status ${response.status}`);
                    }
                    if (!contentType || !contentType.includes("application/json")) {
                        throw new TypeError("Oops, am primit HTML în loc de JSON! Verifică ruta în Traefik.");
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setMessages(data);
                    }
                })
                .catch(error => {
                    console.error("Eroare la încărcarea istoricului:", error.message);
                    setMessages([]); // Prevenim crash-ul prin setarea unui array gol
                });
        };

        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    // 2. Ascultare mesaje noi (WebSocket -> Custom Event)
    useEffect(() => {
        const handleIncomingChat = (event) => {
            const msg = event.detail;
            // Evităm duplicatele dacă mesajul e deja în listă (opțional)
            setMessages(prev => [...prev, msg]);
        };

        window.addEventListener("new-chat-message", handleIncomingChat);
        return () => window.removeEventListener("new-chat-message", handleIncomingChat);
    }, []);

    // 3. Auto-scroll la ultimul mesaj
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        // Trimitem la server (Salvarea în DB se face în backend)
        sendChatMessage(userId, userName, newMessage);

        // OPȚIONAL: Nu mai adăuga myMsg manual aici dacă serverul
        // îl trimite înapoi prin WebSocket, altfel îl vei vedea de două ori.
        // Dacă serverul NU trimite înapoi mesajele proprii, păstrează setMessages de mai jos:
        const myMsg = { senderId: userId, senderName: "Me", content: newMessage };
        setMessages(prev => [...prev, myMsg]);

        setNewMessage("");
    };

    return (
        <Card style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
            display: 'flex', flexDirection: 'column',
            width: isMinimized ? '200px' : '350px',
            height: isMinimized ? '45px' : '450px',
            overflow: 'hidden',
            minWidth: '250px'
        }}>
            <CardHeader
                className="bg-primary text-white d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <strong>Chat Suport</strong>
                <span>{isMinimized ? '▲' : '▼'}</span>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardBody style={{ flex: '1', overflowY: 'auto', background: '#f8f9fa' }} innerRef={scrollRef}>
                        <ListGroup flush>
                            {messages.map((msg, i) => (
                                <ListGroupItem key={i} className="border-0 bg-transparent p-2">
                                    <div className={msg.senderName === "Me" || msg.senderId === userId ? "text-right" : "text-left"}>
                                        <small className="text-muted d-block">{msg.senderName}</small>
                                        <div className={`p-2 rounded d-inline-block text-left ${
                                            msg.senderName === "Me" || msg.senderId === userId ? "bg-primary text-white" :
                                                msg.senderName === "Smart-AI" || msg.senderName === "Assistant" ? "bg-info text-white" : "bg-white border text-dark"
                                        }`} style={{ maxWidth: '80%', wordBreak: 'break-word' }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardBody>
                    <CardFooter className="p-2">
                        <div className="d-flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Scrie un mesaj..."
                            />
                            <Button color="primary" onClick={handleSend}>Send</Button>
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export default ChatContainer;