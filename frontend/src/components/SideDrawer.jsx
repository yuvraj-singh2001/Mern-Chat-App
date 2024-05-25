import React from 'react'
import { useState, useContext } from 'react';
import { Box } from '@chakra-ui/layout'
import {
    Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    Input, useToast, Spinner
} from '@chakra-ui/react'
import { BellIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Hide } from '@chakra-ui/react'
import chatContext from '../context/ChatContext'
import '../App.css'
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem'
import { getSender } from '../config/config'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge'

const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const toast = useToast();

    const navigate = useNavigate()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = useContext(chatContext)

    const logOutFunc = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
        }
        try {

            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.post('http://localhost:5000/api/chat', { userId }, config)

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setLoadingChat(false)
            setSelectedChat(data)
            onClose()
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (

        <>
            <Box
                justifyContent="space-between"
                alignItems="center"
                bg="blue.800"
                w="98%"
                p="5px 10px 5px 10px"
                borderWidth="2px"
                borderColor="blue.800"
                mt={2}
                mx='auto'
                borderRadius='lg'
                fontFamily='Open Sans'
                style={{ display: 'flex' }}>
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen} bg='blue.200'>
                        <SearchIcon />
                        <Hide below='md'>
                            <Text d={{ base: "none", md: "flex" }} px={4}>
                                Search User
                            </Text>
                        </Hide>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" color='white'>
                    Chatter's Paradise
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon h={7} w={7} m={1} color="red.400" />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton p={1} as={Button} bg='green.200'>
                            <ChevronDownIcon color='black' h={7} w={7} m={1} />
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList bg='blue.200'>
                            <ProfileModal user={user}>
                                <MenuItem>
                                    My Profile
                                </MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logOutFunc}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent bg='blue.200'>
                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box style={{ display: 'flex' }} pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml='auto' style={{ display: 'flex' }} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default SideDrawer