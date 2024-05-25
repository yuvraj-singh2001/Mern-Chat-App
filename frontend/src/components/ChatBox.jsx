import React from 'react'
import chatContext from '../context/ChatContext'
import { useState, useContext, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

    const { selectedChat } = useContext(chatContext)

    return (
        <Box display={{ base: selectedChat ? "flex" : "none", sm: "flex" }}

            alignItems="center"
            flexDir="column"
            p={3}
            bg="blue.800"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            color='white'>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox
