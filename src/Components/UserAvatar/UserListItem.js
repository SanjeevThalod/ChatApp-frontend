import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react';

export default function UserListItem({user,handleFunction}) {
  return (
    <Box
      onClick={handleFunction}
      cursor='pointer'
      bg='#E8E8E8'
      _hover={{background:'#800080',color:'white'}}
      w='100%'
      display='flex'
      alignItems='center'
      color='black'
      px={3}
      py={2}
      mb={2}
      borderRadius='5px'
    >
        <Avatar
            mr={2}
            size='sm'
            cursor='pointer'
            name={user.name}
            src={user.pic}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize='xs'>
                <b>Email: </b>
                {user.email}
            </Text>
        </Box>
    </Box>
  )
}
