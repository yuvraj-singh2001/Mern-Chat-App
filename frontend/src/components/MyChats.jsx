import React from 'react'
import { useState, useContext, useEffect } from 'react';
import chatContext from '../context/ChatContext'
import { Box, Button, useToast, Stack, Text } from '@chakra-ui/react'
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading';
import { getSender } from '../config/config';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
    const toast = useToast();

    const [loggedUser, setLoggedUser] = useState()
    const { selectedChat, user, setSelectedChat, chats, setChats } = useContext(chatContext)

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("http://localhost:5000/api/chat", config)
            console.log(data)
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchChats()
    }, [fetchAgain])


    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="#253663"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderColor="#253663"
            borderWidth="1px">
            <Box pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px", sm: "10px" }}
                style={{ display: 'flex' }}
                w="100%"
                justifyContent="space-between"
                alignItems="center">
                My Chats
                <GroupChatModal>
                    <Button style={{ display: 'flex' }}
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}>
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box style={{ display: 'flex' }}
                flexDir="column"
                p={3}
                bg="#253663"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden">
                {
                    chats ? (
                        <Stack overflowY="scroll">
                            {chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#47d6a3" : "#7b9ac9"}
                                    color={selectedChat === chat ? "black" : "white"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    ) : <ChatLoading />
                }
            </Box>
        </Box>
    )
}

export default MyChats