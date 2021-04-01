import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from "../hooks/useLocalStorage";
import {useContacts} from "./ContactsProvider";
import {useSocket} from "./SocketProvider";

const ConversationsContext = React.createContext();

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [selectConvIdx, setSelectConvIdx] = useState(0)
    const { contacts } = useContacts()
    const socket = useSocket()

    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages: [] }]
        })
    }

    const  addMessageToConversation = useCallback(({ recipients, text, sender }) => {
        setConversations(prev => {
            let madeChange = false
            const newMessage = { sender, text }
            const newConv = prev.map(item => {
                if (arrayEquality(item.recipients, recipients)) {
                    madeChange = true
                    return { ...item, messages: [...item.messages, newMessage] }
                }
                return item
            })
            if (madeChange) {
                return newConv
            } else {
                return [ ...prev, { recipients, messages: [newMessage] }]
            }
        })
    }, [setConversations])

    useEffect(() => {
        if (!socket) return
        socket.on('receive-message', addMessageToConversation)
        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])

    function sendMessage(recipients, text) {
        socket.emit('send-message', { recipients, text })
        addMessageToConversation({ recipients, text, sender: id })
    }

    const formattedConversations = conversations.map((item, index) => {
        const recipients = item.recipients.map(rec => {
            const contact = contacts.find(contact => contact.id === rec)
            const name = (contact && contact.name) || rec
            return { id: rec, name }
        })
        const messages = item.messages.map(mess => {
            const contact = contacts.find(cont => cont.id === mess.sender)
            const name = (contact && contact.name) || mess.sender
            const fromMe = id === mess.sender
            return { ...mess, senderName: name, fromMe }
        })
        const selected = index === selectConvIdx
        return { ...item, messages, recipients, selected }
    })

    const value = {
        conversations: formattedConversations,
        selectConv: formattedConversations[selectConvIdx],
        selectConvIdx: setSelectConvIdx,
        sendMessage,
        createConversation
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}

function arrayEquality(a, b) {
    if (a.length !== b.length) return false
    a.sort()
    b.sort()
    return a.every((el, indx) => {
        return el === b[indx]
    })
}