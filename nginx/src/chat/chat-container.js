import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { getUserId, getUserName } from '../commons/auth/jwt-utils';
import { sendChatMessage } from './chat-api';
import {connectToNotifications} from "../monitoring/api/notification-api";

function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(true);

    const userId = getUserId();
    const userName = getUserName() || "User";
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (userId) {
            connectToNotifications(userId);
        }
    }, [userId]);

    useEffect(() => {
        const handleIncomingChat = (event) => {
            const msg = event.detail;
            setMessages(prev => [...prev, msg]);
        };

        window.addEventListener("new-chat-message", handleIncomingChat);

        return () => {
            window.removeEventListener("new-chat-message", handleIncomingChat);
        };
    }, []);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const myMsg = { senderId: userId, senderName: "Me", content: newMessage, isFromAdmin: false };
        setMessages(prev => [...prev, myMsg]);
        sendChatMessage(userId, userName, newMessage);
        setNewMessage("");
    };

    return (
        <Card style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
            display: 'flex', flexDirection: 'column',
            width: isMinimized ? '250px' : '350px',
            height: isMinimized ? '45px' : '450px'
        }}>
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer' }} onClick={() => setIsMinimized(!isMinimized)}>
                <strong>Chat Suport</strong>
                <span>{isMinimized ? '▲' : '▼'}</span>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardBody style={{ flex: '1', overflowY: 'auto', background: '#f8f9fa' }} innerRef={scrollRef}>
                        <ListGroup flush>
                            {messages.map((msg, i) => (
                                <ListGroupItem key={i} className="border-0 bg-transparent p-2">
                                    <div className={msg.senderName === "Me" ? "text-right" : "text-left"}>
                                        <small className="text-muted d-block">{msg.senderName}</small>
                                        <div className={`p-2 rounded d-inline-block text-left ${
                                            msg.senderName === "Me" ? "bg-primary text-white" :
                                                msg.isFromAdmin ? "bg-warning text-dark" :
                                                    msg.senderName === "Smart-AI" ? "bg-info text-white" : "bg-white border text-dark"
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
                            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                   onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Scrie 'admin' pentru suport..." />
                            <Button color="primary" onClick={handleSend}>Send</Button>
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export default ChatContainer;