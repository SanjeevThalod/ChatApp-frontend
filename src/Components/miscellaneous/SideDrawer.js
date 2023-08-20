import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, Avatar, MenuDivider, useDisclosure, Input, useToast, Spinner, Badge } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import axios from 'axios';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../Config/ChatLogics';

export default function SideDrawer() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const logoutHandler = async () => {
    window.location.href = '/';
    localStorage.removeItem("userInfo");
  }
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${process.env.REACT_APP_URL}/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error Occured',
        description: "Failed to load the results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post(`${process.env.REACT_APP_URL}/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the Chat",
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User" hasArrow placement='bottom'>
          <Button variant='ghost' onClick={onOpen}><i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px='4'>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize='2xl' m={2} />
              <Badge colorScheme='red' borderRadius={'100%'} px={1.5} style={{position:'relative',right:'18px',top:'-9px'}}>{notification.length > 0 ? notification.length:null}</Badge>
            </MenuButton>
            <MenuList p={2}>
              {!notification.length && 'No new Messages'}
              {notification.map(noti => (
                <MenuItem key={noti._id} onClick={() => { setSelectedChat(noti.chat); setNotification(notification.filter((n) => n !== noti)) }}>
                  {noti.chat.isGroupChat ? `New Message in ${noti.chat.chatName}` : `New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading />) : (
              searchResults.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
