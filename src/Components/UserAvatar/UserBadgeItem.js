import { CloseIcon, StarIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({user,selectedChat,handleFunction}) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius='20px'
      m={1}
      mb={2}
      variant='solid'
      fontSize='12px'
      bg={'blue'}
      color={'white'}
      cursor='pointer'
      onClick={handleFunction}
      fontFamily={'Work sans'}>
      {user.name}
      {selectedChat.groupAdmin === user._id ? <StarIcon ml={1} mb={0.6}/>:null}
      <CloseIcon pl={1}/>
    </Box>
  )
}
