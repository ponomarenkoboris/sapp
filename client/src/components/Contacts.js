import React from 'react';
import { ListGroup } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";

export default function Contacts() {
    const { contacts } = useContacts()

    return (
        <ListGroup variant="flush">
            {contacts.map(item => (
                <ListGroup.Item key={item.id}>
                    {item.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}