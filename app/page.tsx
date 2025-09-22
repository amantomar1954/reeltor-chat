"use client";

import { useState, useEffect } from 'react';
import { Chat } from '@/types/chat';
import { currentUser } from '@/lib/mockData';
import { useSocket } from '@/hooks/useSocket';
import { chatService } from '@/lib/chatService';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import EmptyState from '@/components/EmptyState';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // show chat list by default

  const {
    socket,
    isConnected,
    connectionError,
    reconnect,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markMessageAsRead
  } = useSocket(currentUser.id);


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

  // Activity heartbeat
  useEffect(() => {
    const stopHeartbeat = chatService.startActivityHeartbeat();
    return stopHeartbeat;
  }, []);


  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);

    // Join conversation using new API
    joinConversation(chat.id);

    // Mark conversation as read
    chatService.markConversationAsRead(chat.id).catch(err => {
      console.warn('Failed to mark conversation as read:', err);
    });

    if (isMobile) setShowSidebar(false); // hide chat list when opening a chat
  };

  const handleBack = () => {
    if (selectedChat) {
      leaveConversation(selectedChat.id);
    }
    setSelectedChat(undefined);
    setShowSidebar(true); // show chat list again on mobile
  };

  const handleSendMessage = async (text: string) => {
    // Since ChatWindow is now self-contained, this function can be simplified
    // or the logic can be moved to ChatWindow itself
    console.log('Sending message from main app:', text);
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar / Chat List */}
      {showSidebar && (
        <div className={`
          ${isMobile ? 'absolute z-50 h-full w-full bg-white' : 'relative w-80'}
          shadow-lg flex flex-col
        `}>
          <ConnectionStatus
            isConnected={isConnected}
            connectionError={connectionError}
            onReconnect={reconnect}
          />
          <div className="flex-1">
            <ChatSidebar
              selectedChat={selectedChat}
              onChatSelect={handleChatSelect}
              isMobile={isMobile}
              isOpen={showSidebar}
              onToggle={() => setShowSidebar(!showSidebar)}
            />
          </div>
        </div>
      )}

      {/* Main Content / Chat Window */}
      <div className={`flex-1 flex flex-col relative ${showSidebar && isMobile ? 'hidden' : 'block'}`}>
        {!showSidebar && !isMobile && (
          <ConnectionStatus
            isConnected={isConnected}
            connectionError={connectionError}
            onReconnect={reconnect}
          />
        )}
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
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
