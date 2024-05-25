import React from 'react'
import chatContext from './ChatContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ChateState = ({ children }) => {

    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])

    const navigate = useNavigate()

    useEffect(() => {

        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo)

        if (!userInfo) {
            navigate('/')
        }

    }, [navigate])

    return (
        <chatContext.Provider value={{ user, setUser, setSelectedChat, selectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </chatContext.Provider>
    )
}

export default ChateState