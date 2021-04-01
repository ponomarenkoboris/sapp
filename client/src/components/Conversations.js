import React from 'react';
import {ListGroup} from "react-bootstrap";
import {useConversations} from "../context/ConversationsProvider";

export default function Conversations() {
    const { conversations, selectConvIdx } = useConversations()
    return (
        <ListGroup variant="flush">
            {conversations.map((item, idx) => (
                <ListGroup.Item
                    key={idx}
                    action
                    onClick={() => selectConvIdx(idx)}
                    active={item.selected}
                >
                    {item.recipients.map(rec => rec.name).join(', ')}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}