import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Badge,
  Box,
  Button,
  Image,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderImage } from "../../Config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

export default function MyChats({ fetchAgain }) {
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      //console.log(error);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  console.log(chats);
  console.log(notification);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="5px"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        borderRadius="5px"
        overflowY="scroll"
        w="100%"
        h={"100%"}
      >
        {chats ? (
          <Stack overflowY="scroll" w="100%" h={"100%"}>
            {chats.map((chat) => {
              // Filter notifications to get the count for this chat
              const notificationCount = notification.filter(
                (not) => not.chat._id === chat._id
              ).length;

              return (
                <Box
                onClick={() => {
                  setSelectedChat(chat);
                  setNotification(notification.filter((not) => not.chat._id !== chat._id));
                }}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#800080" : "#e8e8e8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  w="100%"
                  borderRadius="5px"
                  key={chat._id}
                  display={"flex"}
                  flexDir={"row"}
                  alignItems={"center"}
                >
                  <Image
                    borderRadius="full"
                    boxSize="30px"
                    src={
                      !chat.isGroupChat
                        ? getSenderImage(loggedUser, chat.users)
                        : "https://res.cloudinary.com/dycxuzuon/image/upload/v1692508558/166258_nqoutt.png"
                    }
                    alt={getSender(loggedUser, chat.users)}
                    mr={3}
                  />
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  <Spacer />
                  {notificationCount > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius={"100%"}
                      px={1.5}
                      ml={2}
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}
