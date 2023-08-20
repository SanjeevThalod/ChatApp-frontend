import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from '../SingleChat';

export default function ChatBox({fetchAgain,setFetchAgain}) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{base:selectedChat?'flex':'none',md:'flex'}}
      w={{base:'100%',md:'68%'}}
      alignItems='center'
      flexDir='column'
      bg='white'
      borderRadius='5px'
      borderWidth='1px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}
