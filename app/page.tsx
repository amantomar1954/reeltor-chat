"use client";

import { useState, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';
import {
  fetchChats,
  fetchMessages,
  sendMessageToAPI,
  currentUser
} from '@/lib/mockData';
import { useSocket } from '@/hooks/useSocket';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import EmptyState from '@/components/EmptyState';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // show chat list by default

  const { socket, joinChat, leaveChat, sendMessage: socketSendMessage } = useSocket(currentUser.id);

  // Load chats and messages
  useEffect(() => {
    const loadData = async () => {
      try {
        const userChats = await fetchChats();
        setChats(userChats);

        const allMessages: { [chatId: string]: Message[] } = {};
        for (const chat of userChats) {
          allMessages[chat.id] = await fetchMessages(chat.id);
        }
        setMessages(allMessages);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(true); // show chat list on mobile by default
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message: Message) => {
      const chatId = `chat-${message.senderId}`;
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));

      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: message, unreadCount: chat.unreadCount + 1 }
          : chat
      ));
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    joinChat(chat.id);

    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));

    if (isMobile) setShowSidebar(false); // hide chat list when opening a chat
  };

  const handleBack = () => {
    if (selectedChat) leaveChat(selectedChat.id);
    setSelectedChat(undefined);
    setShowSidebar(true); // show chat list again on mobile
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChat) return;

    try {
      const newMessage = await sendMessageToAPI(selectedChat.id, { text, type: 'text' });
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));

      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id ? { ...chat, lastMessage: newMessage } : chat
      ));

      socketSendMessage(newMessage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar / Chat List */}
      {showSidebar && (
        <div className={`
          ${isMobile ? 'absolute z-50 h-full w-full bg-white' : 'relative w-80'}
          shadow-lg
        `}>
          <ChatSidebar
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            isMobile={isMobile}
            isOpen={showSidebar}
            onToggle={() => setShowSidebar(!showSidebar)}
          />
        </div>
      )}

      {/* Main Content / Chat Window */}
      <div className={`flex-1 flex flex-col relative ${showSidebar && isMobile ? 'hidden' : 'block'}`}>
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages[selectedChat.id] || []}
            onSendMessage={handleSendMessage}
            onBack={isMobile ? handleBack : undefined}
            isMobile={isMobile}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
