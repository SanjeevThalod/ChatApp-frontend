import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

export default function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState();
    const toast = useToast();
    const { user, chats, setChats } = ChatState();
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
            setSearchResult(data);
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
    const handleGroup = (userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:'User already added',
                status:'warning',
                duration:3000,
                isClosable:true,
                position:'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    }
    const handleSubmit = async() => {
        if(!groupChatName){
            toast({
                title:'Enter Group Name',
                status:'warning',
                duration:3000,
                position:'top'
            });
            return;
        }else if(!selectedUsers || selectedUsers.length < 2){
            toast({
                title:'Add atleast two members',
                status:'warining',
                duration:3000,
                position:'top'
            });
            return;
        }
        try {
            const config={
                headers:{
                    authorization:`Bearer ${user.token}`
                }
            };
            const {data} = await axios.post(`${process.env.REACT_APP_URL}/chat/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config);
            setChats([data,...chats]);
            onClose();
            toast({
                title:'New Group created',
                status :'success',
                duration:3000,
                position:'top',
            });
        } catch (error) {
            toast({
                title:"Couldn't create group",
                description:'Please try again later',
                duration:5000,
                isClosable:true,
                status:'error',
                position:'top'
            });
        }
    }
    const handleDelete=(userToDel)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== userToDel._id))
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    > Create Group
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center'>
                        <FormControl>
                            <Input placeholder='Group Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users' mb={3} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box display={'flex'} flexDir={'row'} flexWrap={'wrap'}>
                            {selectedUsers.map(u=>(
                                <UserBadgeItem
                                key={user._id} 
                                user={u}
                                selectedChat={selectedUsers}
                                handleFunction={()=>handleDelete(u)} />
                            ))}
                        </Box>
                        {loading ? <div>Loading...</div> : searchResult?.slice(0, 4).map(((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleGroup(user)} />
                        )))}
                    </ModalBody>

                    <ModalFooter>
                        <Button bg={'purple'} _hover={{bg:'	#BF40BF'}} color={'white'} mr={3} onClick={handleSubmit}>
                            Create Group
                        </Button>
                        <Button colorScheme='red' onClick={onClose}>
                            close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
