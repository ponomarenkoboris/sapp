import React, { useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { useConversations } from '../context/ConversationsProvider'
import { useContacts } from "../context/ContactsProvider";

export default function NewConversationModal({ closeModal }) {
    const [selectedContactsIds, setSelectedContactsIds] = useState([])
    const { contacts } = useContacts()
    const { createConversation } = useConversations()

    function handleSubmit(e) {
        e.preventDefault()
        createConversation(selectedContactsIds)
        closeModal()
    }

    function handleCheckboxChange(id) {
        setSelectedContactsIds(prev => {
            if (prev.includes(id)) return prev.filter(prevId => id !== prevId)
            return [...prev, id]
        })
    }

    return (
        <>
            <Modal.Header closeButton>Create Conversation</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {contacts.map(item => (
                        <Form.Group controlId={item.id} key={item.id}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactsIds.includes(item.id)}
                                label={item.name}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}