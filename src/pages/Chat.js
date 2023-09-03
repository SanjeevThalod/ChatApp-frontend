import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/miscellaneous/SideDrawer';
import MyChats from '../Components/miscellaneous/MyChats';
import ChatBox from '../Components/miscellaneous/ChatBox';
import { ChatState } from "../Context/ChatProvider"
import { useState } from 'react';
import StartTip from '../Components/StartTip';

export default function Chat() {
    const { user } = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false);
    return (
        <div style={{ width: '100%' }}>
            <StartTip/>
            {user && <SideDrawer />}
            <Box
                display='flex'
                justifyContent='space-between'
                w="100%"
                h="91.5vh"
                p="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </Box>
        </div>
    )
}
