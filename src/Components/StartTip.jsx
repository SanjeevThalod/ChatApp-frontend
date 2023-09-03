import  { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export default function StartTip() {
  const toast = useToast();

  useEffect(() => {
    const checkOnline = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_URL}`);
      } catch (error) {
        toast({
          title: 'Please wait a minute or two',
          description:
            'Since this app runs on free hosting, it takes time for the backend to fire up again after inactivity',
          isClosable: true,
          position: 'top',
          status: 'warning',
        });
      }
    };

    checkOnline();
  }, [toast]);

  return null; // Since this component is for side-effect only, you can return null
}
