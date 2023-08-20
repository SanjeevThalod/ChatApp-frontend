import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'

export default function Signup() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [conpass, setConpass] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const postDetails = async (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Error Occured',
                description: "Couldn't fetch the Image",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        } else {
            if (pics.type === 'image/jpeg' || pics.type === 'image/jpg' || pics.type === 'image/png' || pics.type === 'image/gif') {
                const formData = new FormData();
                formData.append("file", pics);
                formData.append("cloud_name", "dycxuzuon");
                formData.append("upload_preset", "chat-app");
                try {
                    fetch(`${process.env.REACT_APP_CLOUDINARY}/image/upload`, {
                        method: 'POST',
                        body: formData
                    }).then((res) => {
                        return res.json();
                    }).then((data) => {
                        setPic(data.secure_url);
                        toast({
                            title: 'Image uploaded successfully!',
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                            position: 'bottom',
                        });
                        setLoading(false);
                    })
                } catch (error) {
                    console.log({ cloudinaryError: error });
                    setLoading(false);
                }
            } else {
                toast({
                    title: 'Invalid File type',
                    description: "only jpeg,jpg,png and gif accepted",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
                setLoading(false);
                return;
            }
        }
    }
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !pass || !conpass) {
            toast({
                title: "All fields are compulsory",
                status: 'Warning',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
        if (pass !== conpass) {
            toast({
                title: "Both password must be Equal!",
                status: 'Warning',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const mal = {
                "name":name,
                "email":email,
                "password":pass,
                "pic":pic
            }
            const { data } = await axios.post(`${process.env.REACT_APP_URL}/user/signup`, mal, config);
            toast({
                title: "Registration Successfull!",
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate('chats')
        } catch (error) {
            console.log({error:error});
        }
    }
    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name'
                    variant='filled'
                    colorScheme='purple.400'
                    bg="purple.100"
                    _hover={{ bg: 'purple.100' }}
                    _focus={{ bg: 'white', borderColor: 'purple.500' }}
                    onChange={(event) => setName(event.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email'
                    variant='filled'
                    colorScheme='purple.400'
                    bg="purple.100"
                    _hover={{ bg: 'purple.100' }} _
                    _focus={{ bg: 'white', borderColor: 'purple.500' }}
                    onChange={(event) => setEmail(event.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Enter Your Password'
                        variant='filled'
                        type={show ? 'text' : 'password'}
                        colorScheme='purple.400'
                        bg="purple.100"
                        _hover={{ bg: 'purple.100' }} _
                        _focus={{ bg: 'white', borderColor: 'purple.500' }}
                        onChange={(event) => setPass(event.target.value)} />
                    <InputRightElement >
                        <Button h='1.75rem' size='sm' bg='purple.100' mr={4} onClick={() => show ? setShow(false) : setShow(true)}>{show ? 'Show' : 'Hide'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Confirm Your Password'
                        variant='filled'
                        type={show ? 'text' : 'password'}
                        colorScheme='purple.400'
                        bg="purple.100"
                        _hover={{ bg: 'purple.100' }} _
                        _focus={{ bg: 'white', borderColor: 'purple.500' }}
                        onChange={(event) => setConpass(event.target.value)} />
                    <InputRightElement >
                        <Button h='1.75rem' size='sm' bg='purple.100' mr={4} onClick={() => show ? setShow(false) : setShow(true)}>{show ? 'Show' : 'Hide'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' isRequired>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='Image/*'
                    onChange={(event) => postDetails(event.target.files[0])}
                />
            </FormControl>
            <Button
                bg={'purple'}
                mt={4}
                width={'100%'}
                color={'white'}
                _hover={{ bg: 'purple.500' }}
                isLoading={loading}
                onClick={submitHandler}
            >SignUp</Button>
        </VStack>
    )
}
