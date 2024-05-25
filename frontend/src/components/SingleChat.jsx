import React from 'react'
import { useState, useContext, useEffect } from 'react'
import chatContext from '../context/ChatContext'
import { Box, IconButton, Spinner, Text, FormControl, Input, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/config'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import axios from 'axios'
import '../style.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'

const ENDPOINT = 'https://chatterparadise.herokuapp.com/chat'

var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {


    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [istyping, setIsTyping] = useState(false)
    const toast = useToast()

    const { user, selectedChat, setSelectedChat, notification, setNotification } = useContext(chatContext)

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])



    const fetchMessages = async () => {
        if (!selectedChat) {
            return
        }
        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            setLoading(true)

            const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config)

            setMessages(data)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)
            console.log(data)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }

    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat

    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                    console.log(notification)
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });



    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:5000/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                )
                console.log(data)
                setMessages([...messages, data])
                socket.emit('new message', data)
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                })
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)


        if (!socketConnected) {
            return;
        }
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000

        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff > timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength);

    }

    return <>
        {
            selectedChat ? (<>
                <Text fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily='Open Sans'
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center">
                    <IconButton dispaly={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")} bg='green.200' color='black' />
                    {(!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchMessages={fetchMessages}
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        </>
                    ))}
                </Text>

                <Box display='flex'
                    flexDirection='column'
                    justifyContent="flex-end"
                    p={3}
                    bg="gray.800"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                    color='white'>
                    {loading ? <Spinner
                        w={10}
                        h={10}
                    /> : <div className='messages'>
                        <ScrollableChat messages={messages} />
                    </div>}
                    <FormControl onKeyDown={sendMessage} isRequired>
                        {istyping ? <div>Typing</div> : <></>}
                        <Input variant="filled"
                            bg="#485761"
                            placeholder="Enter a message.."
                            value={newMessage}
                            color='white'
                            onChange={typingHandler} />
                    </FormControl>
                </Box>

            </>) : (<Box d="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3}>
                    Click on a user to start chatting
                </Text>
            </Box>)
        }
    </>

}

export default SingleChat