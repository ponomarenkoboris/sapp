import React, { useState, useCallback} from 'react';
import { Form, InputGroup, Button } from "react-bootstrap";
import {useConversations} from "../context/ConversationsProvider";

export default function OpenConversation() {
    const [text, setText] = useState()
    const { sendMessage, selectConv } = useConversations()
    const setRef = useCallback(node => {
        if (node) node.scrollIntoView({ smooth: true })
    }, [])
    function handleSubmit(e) {
        e.preventDefault()
        sendMessage(
            selectConv.recipients.map(item => item.id),
            text
        )
        setText('')
    }

    return (
        <div className="d-flex flex-column flex-grow-1">
            <div className="flex-grow-1 overflow-auto">
                <div className="h-100 d-flex flex-column align-items-start justify-content-end px-3">
                    {selectConv.messages.map((mess, idx) => {
                        const lastMessage = selectConv.messages.length - 1 === idx
                        return (
                            <div
                                ref={lastMessage ? setRef : null}
                                key={idx}
                                className={`my-1 d-flex flex-column ${mess.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
                            >
                                <div className={`rounded px-2 py-1 ${mess.fromMe ? 'bg-primary text-white' : 'border'}`}>
                                    {mess.text}
                                </div>
                                <div className={`text-muted small ${mess.fromMe ? 'text-right' : ''}`}>
                                    {mess.fromMe ? 'You' : mess.senderName}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="m-2">
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            required
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{ height: '75px', resize: 'none' }}
                        />
                        <InputGroup.Append>
                            <Button type="submit">Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    )
}
