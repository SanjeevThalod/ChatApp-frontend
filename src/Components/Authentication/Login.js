import { VStack, FormControl, Input, FormLabel, InputGroup, Button, InputRightElement } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { React, useState } from 'react'

export default function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const submitHandler = async () => {
        setLoading(true);
        if (!email || !pass) {
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
        const mal = {
            "email": email,
            "password": pass
        }
        const config = {
            headers: {
                "Content-Type": 'application/json'
            }
        }
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_URL}/user/login`, mal, config);
            setLoading(false);
            localStorage.setItem("userInfo",JSON.stringify(data));
            navigate('chats');
        } catch (error) {
            console.log({error:error});
            toast({
                title:'Invalid Credentials',
                description:'Note:Fields are case Sensitive',
                duration:5000,
                isClosable:true,
                status:'error'
            });
            setLoading(false);
            return;
        }

    };
    const guestHandler = () => {
        setEmail('guest3@gmail.com');
        setPass('12345678');
    };
    return (
        <VStack>
            <FormControl id='email1' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email'
                    variant='filled'
                    colorScheme='purple.400'
                    bg="purple.100"
                    _hover={{ bg: 'purple.100' }} _
                    _focus={{ bg: 'white', borderColor: 'purple.500' }}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)} />
            </FormControl>
            <FormControl id='password1' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Enter Your Password'
                        variant='filled'
                        type={show ? 'text' : 'password'}
                        colorScheme='purple.400'
                        bg="purple.100"
                        _hover={{ bg: 'purple.100' }}
                        value={pass}
                        _focus={{ bg: 'white', borderColor: 'purple.500' }}
                        onChange={(event) => setPass(event.target.value)} />
                    <InputRightElement >
                        <Button h='1.75rem' size='sm' bg='purple.100' mr={4} onClick={() => show ? setShow(false) : setShow(true)}>{show ? 'Show' : 'Hide'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                bg={'purple'}
                mt={4}
                width={'100%'}
                color={'white'}
                _hover={{ bg: 'purple.500' }}
                onClick={submitHandler}
            >Login</Button>
            <Button
                bg={'red'}
                width={'100%'}
                color={'white'}
                _hover={{ bg: 'red.400' }}
                isLoading={loading}
                onClick={guestHandler}
            >Get Guest Credentials</Button>
        </VStack>
    )
}
