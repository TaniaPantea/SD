import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Card, CardBody, Input, Button, CardHeader } from 'reactstrap';
import { getUserId } from '../commons/auth/jwt-utils';
import { connectToNotifications, subscribeToAdminMessages, sendAdminReply } from '../monitoring/api/notification-api';

function AdminChatContainer() {
    // { [userId]: { userName, messages: [] } }
    const [chats, setChats] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [replyText, setReplyText] = useState("");

    const userId = getUserId(); // ID-ul administratorului logat

    useEffect(() => {
        if (!userId) return;

        connectToNotifications(userId);

        let subscription;

        const setupSubscription = () => {
            subscription = subscribeToAdminMessages((msg) => {
                setChats(prev => {
                    const senderId = msg.senderId;
                    const existingChat = prev[senderId] || { userName: msg.senderName, messages: [] };

                    return {
                        ...prev,
                        [senderId]: {
                            ...existingChat,
                            messages: [...existingChat.messages, msg]
                        }
                    };
                });
            });
        };

        const timeoutId = setTimeout(setupSubscription, 500);

        return () => {
            clearTimeout(timeoutId);
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [userId]);

    const handleReply = () => {
        if (!replyText.trim() || !selectedUser) return;

        // la sswrver către /app/admin.reply
        sendAdminReply(selectedUser, replyText);

        setChats(prev => ({
            ...prev,
            [selectedUser]: {
                ...prev[selectedUser],
                messages: [...prev[selectedUser].messages, {
                    senderName: "Me (Admin)",
                    content: replyText,
                    isFromAdmin: true,
                    timestamp: new Date().getTime()
                }]
            }
        }));
        setReplyText("");
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Row>
                <Col md="4">
                    <Card>
                        <CardHeader className="bg-dark text-white">Utilizatori cu cereri admin</CardHeader>
                        <ListGroup flush>
                            {Object.keys(chats).length === 0 && (
                                <ListGroupItem>Nicio cerere activă...</ListGroupItem>
                            )}
                            {Object.keys(chats).map(uId => (
                                <ListGroupItem
                                    key={uId}
                                    active={selectedUser === uId}
                                    onClick={() => setSelectedUser(uId)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {chats[uId].userName}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>

                {/* Fereastra de chat din dr */}
                <Col md="8">
                    {selectedUser ? (
                        <Card>
                            <CardHeader className="bg-primary text-white">
                                Conversație cu {chats[selectedUser].userName}
                            </CardHeader>
                            <CardBody style={{ height: '400px', overflowY: 'auto', background: '#f8f9fa' }}>
                                {chats[selectedUser].messages.map((m, i) => (
                                    <div key={i} className={m.isFromAdmin ? "text-right" : "text-left"}>
                                        <small className="text-muted d-block">{m.senderName}</small>
                                        <div className={`p-2 m-1 rounded d-inline-block ${
                                            m.isFromAdmin ? "bg-warning text-dark" : "bg-white border text-dark"
                                        }`} style={{ maxWidth: '80%' }}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                            <div className="p-3 border-top d-flex">
                                <Input
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                                    placeholder="Scrie răspunsul către utilizator..."
                                />
                                <Button color="success" className="ml-2" onClick={handleReply}>Send</Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="text-center p-5 border rounded bg-light">
                            <h5>Selectați un utilizator din listă pentru a răspunde.</h5>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminChatContainer;