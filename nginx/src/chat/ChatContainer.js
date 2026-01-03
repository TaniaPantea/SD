import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { getUserId, getUserName } from '../commons/auth/jwt-utils';
import { sendChatMessage, subscribeToChat } from './chat-api';

function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const userId = getUserId();
    const userName = getUserName() || "User";
    const scrollRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let subscription = null;
        let retryInterval = null;

        const attemptSubscription = () => {
            subscription = subscribeToChat(userId, (msg) => {
                setMessages(prev => [...prev, msg]);
                setIsTyping(false);
            });

            if (subscription) {
                console.log("Chat subscription successful");
                if (retryInterval) clearInterval(retryInterval);
            }
        };

        // Încercăm prima dată
        attemptSubscription();

        // Dacă nu s-a putut (clientul nu e încă 'active'), mai încercăm la fiecare secundă
        if (!subscription) {
            retryInterval = setInterval(() => {
                attemptSubscription();
            }, 1000);
        }

        return () => {
            if (subscription) subscription.unsubscribe();
            if (retryInterval) clearInterval(retryInterval);
        };
    }, [userId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim() !== "") {
            const now = new Date().getTime();
            const myMsg = {
                senderId: userId,
                senderName: "Me",
                content: newMessage,
                timestamp: now,
                isFromAdmin: false
            };

            setMessages(prev => [...prev, myMsg]);
            setIsTyping(true);
            sendChatMessage(userId, userName, newMessage);
            setNewMessage("");
        }
    };

    return (
        <Card className="shadow-sm chat-window" style={{ maxWidth: '400px', position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {/* Injectăm animația pentru typing direct aici */}
            <style>
                {`
                    @keyframes dot-pulse {
                        0% { opacity: 0.4; }
                        50% { opacity: 1; }
                        100% { opacity: 0.4; }
                    }
                    .typing-dot {
                        animation: dot-pulse 1.5s infinite;
                        font-size: 20px;
                        margin-left: 2px;
                    }
                `}
            </style>

            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                <strong>Customer Support Chat</strong>
            </CardHeader>

            <CardBody style={{ height: '300px', overflowY: 'auto' }} innerRef={scrollRef}>
                <ListGroup flush>
                    {messages.map((msg, index) => {
                        // Logica de identificare a expeditorului
                        const isSentByMe = msg.senderId?.toString() === userId?.toString() || msg.senderName === "Me";
                        const isAI = msg.senderName === "Smart-AI";

                        return (
                            <ListGroupItem key={index} className="border-0 p-2">
                                <div className={isSentByMe ? "text-right" : "text-left"}>
                                    <small className="text-muted d-block">{msg.senderName}</small>
                                    <div className={`p-2 rounded ${
                                        isSentByMe ? "bg-primary text-white" :
                                            isAI ? "bg-info text-white" : "bg-light text-dark"
                                    }`}
                                         style={{
                                             display: 'inline-block',
                                             maxWidth: '85%',
                                             textAlign: 'left',
                                             wordBreak: 'break-word',
                                             boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                         }}>
                                        {msg.content}
                                    </div>
                                </div>
                            </ListGroupItem>
                        );
                    })}

                    {/* Indicator vizual pentru AI Typing */}
                    {isTyping && (
                        <ListGroupItem className="border-0 p-2 text-left">
                            <small className="text-muted d-block">Smart-AI</small>
                            <div className="bg-light p-2 rounded text-dark d-inline-block">
                                <span className="typing-dot">.</span>
                                <span className="typing-dot" style={{ animationDelay: '0.2s' }}>.</span>
                                <span className="typing-dot" style={{ animationDelay: '0.4s' }}>.</span>
                            </div>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </CardBody>

            <CardFooter>
                <div className="d-flex">
                    <Input
                        type="text"
                        placeholder="Adresează o întrebare despre energie..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        color="primary"
                        className="ml-2"
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default ChatContainer;