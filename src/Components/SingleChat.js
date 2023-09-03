import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Badge, Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import io from 'socket.io-client';
import './styles.css'
import ScrollableChat from './ScrollableChat';

const ENDPOINT = '';
var socket, selectedChatCompare;


export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const toast = useToast();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on('connected', () => {
      socket.emit('setup', user);
      setSocketConnected(true);
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    // eslint-disable-next-line
  }, [])
  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
        setNewMessage('');
        const { data } = await axios.post(`${process.env.REACT_APP_URL}/message`, {
          content: newMessage,
          chatId: selectedChat._id
        }, config);
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Could not deliver message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
      }
    }
  }
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`${process.env.REACT_APP_URL}/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
    }
    socket.emit('join chat', selectedChat._id);
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    const handleNewMessageReceived = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification(prevNotification => [newMessageReceived, ...prevNotification]);
          setFetchAgain(prevFetchAgain => !prevFetchAgain);
        }
      } else {
        setMessages(prevMessages => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on('message recieved', handleNewMessageReceived);

    return () => {
        socket.off('message recieved', handleNewMessageReceived);
    };
     // eslint-disable-next-line
}, [selectedChatCompare, notification]);




  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //Tying indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const timeLength = 3000;
    const lastTypingTime = new Date().getTime();
    const typingTimeout = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timeLength);

    // Cleanup the timeout when the component unmounts or when socketConnected changes
    return () => clearTimeout(typingTimeout);
  }
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'>
            <IconButton display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              my={2}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (<>
              {getSender(user, selectedChat.users)}
              <ProfileModel user={getSenderFull(user, selectedChat.users)} />
            </>) : (
              <>{selectedChat.chatName}
                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}</>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#e8e8e8'
            w='100%'
            h='100%'
            borderRadius='5px'
            overflowY='scroll'>
            {loading ? (<Spinner size='xl' w={20} h={20} alignSelf={'center'} margin={'auto'} />) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <Badge borderRadius={'20px'} p={2} ml={1} mb={1} colorScheme='green'>Typing...</Badge> : null}
              <Input variant={'filled'}
                bg={'#e0e0e0'}
                placeholder='Message'
                borderRadius={'20px'}
                onChange={typingHandler}
                value={newMessage} />
            </FormControl>
          </Box>
        </>) : (
        <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Click on a user to start Chatting
          </Text>
        </Box>
      )}
    </>
  )
}
