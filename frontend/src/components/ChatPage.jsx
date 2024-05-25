import React from 'react'
import { Box } from '@chakra-ui/layout'
import SideDrawer from './SideDrawer'
import MyChats from './MyChats'
import ChatBox from '../components/ChatBox'
import { useContext, useState } from 'react'
import chatContext from '../context/ChatContext'

const ChatPage = () => {

  const { user } = useContext(chatContext)
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div style={{ width: "100%", fontFamily: "Open Sans" }}>
      {user && <SideDrawer />}
      <Box justifyContent="space-between" w="100%" h="100vh" p="10px" style={{ display: 'flex' }}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage