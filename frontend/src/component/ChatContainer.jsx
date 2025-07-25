import React, { useEffect,useRef } from 'react'

import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import InputField from './InputField'
import MessageLoader from './MessageLoader'
import { formatTime } from '../utils/formatTime'


function ChatContainer() {
    const {
      messages,
      selectedUser,
      isMessagesLoading,
      getMessages,
      subscribeToMessages,
      unsubscribeFromMessages,
    } = useChatStore();
    const {onlineUsers,userData} = useAuthStore()
    const messageEndRef = useRef(null)

    useEffect(() => {
      getMessages(selectedUser._id)
      subscribeToMessages();

      return () => unsubscribeFromMessages();
    }, [selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages])
    
    useEffect(() => {
      if (messageEndRef.current && messages) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    if(isMessagesLoading){
        return (
          <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageLoader />
            <InputField />
          </div>
        );
    }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === userData._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === userData._id
                      ? userData.profileImg || "/avatar.png"
                      : selectedUser.profileImg || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <InputField />
    </div>
  );
}

export default ChatContainer