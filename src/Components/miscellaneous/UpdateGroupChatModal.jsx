import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

export default function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [renameLoading, setRenameLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleRename = async () => {
        if (!groupChatName) {
            toast({
                title: 'Enter something',
                status: 'warning',
                duration: 3000
            });
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_URL}/chat/group/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);
            setSelectedChat(data);
            setRenameLoading(false);
            toast({
                title: 'Rename successfull',
                duration: 3000,
                position: 'bottom'
            });
            setGroupChatName('')
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: 'Error Occured!!!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            setGroupChatName('');
            return;
        }
    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_URL}/user?search=${search}`, config);
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: 'Failed to find the Users',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
        }
    }
    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin !== user._id && userToRemove._id !== user._id) {
            toast({
                title: 'Only admins can remove someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_URL}/chat/group/remove`, {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config);
             
            userToRemove._id === user._id ? setSelectedChat():setSelectedChat(data);
            setLoading(false);
            toast({
                title:'User removed',
                status:'success',
                duration:3000
            });
            setLoading(false);
            fetchMessages();
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title:'Error Occured',
                status:'error',
                duration:5000,
                isClosable:true
            });
            setLoading(false);
        }
    }
    const handleAddUser = async (usertoAdd) => {
        if (selectedChat.users.find((u) => u._id === usertoAdd._id)) {
            toast({
                title: 'User Already Present',
                status: 'warning',
                duration: 3000,
                position: 'top'
            });
            return;
        }
        if (selectedChat.groupAdmin !== user._id) {
            toast({
                title: 'Only Admins can add Someone',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_URL}/chat/group/add`, {
                chatId: selectedChat._id,
                userId: usertoAdd._id
            }, config);
            setSelectedChat(data);
            setLoading(false);
            toast({
                title: 'User Added',
                status: 'success',
                duration: 3000
            });
            setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error Occured',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            setLoading(false);
            return;
        }
    }
    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize='35px' fontFamily='Work sans' display='flex' justifyContent='center'>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {selectedChat.users.map(u => (
                                <UserBadgeItem key={user._id}
                                    user={u}
                                    selectedChat={selectedChat}
                                    handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl display='flex'>
                            <Input placeholder='Rename Group' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant={'solid'} bg={'purple'} color={'white'} _hover={{ bg: '#9F2B68' }} ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add members to Group' mb='3' onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? (<Spinner />) : <Box maxHeight={'300px'} overflowY={'scroll'}>{searchResults?.map((user) => (
                            <UserListItem key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)} />
                        ))}</Box>}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red'>Leave Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
