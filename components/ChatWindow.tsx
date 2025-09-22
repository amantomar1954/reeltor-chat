"use client";

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, Mic } from 'lucide-react';
import { Chat, Message, User } from '@/types/chat';
import { currentUser } from '@/lib/mockData';
import MessageBubble from './MessageBubble';
import Image from 'next/image';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack?: () => void;
  isMobile: boolean;
}

export default function ChatWindow({ chat, messages, onSendMessage, onBack, isMobile }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const otherUser = chat.participants.find(p => p.id !== currentUser.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // TODO: IMPLEMENT TYPING INDICATOR VIA SOCKET
    const isCurrentlyTyping = e.target.value.length > 0;
    if (isCurrentlyTyping !== isTyping) {
      setIsTyping(isCurrentlyTyping);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // TODO: Send typing status via socket
      // socketSendTyping(chat.id, isCurrentlyTyping);
      
      // Stop typing after 3 seconds of inactivity
      if (isCurrentlyTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          // TODO: Send stop typing via socket
          // socketSendTyping(chat.id, false);
        }, 3000);
      }
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!otherUser) return null;

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5]">
      {/* Chat Header */}
      <div className="bg-[#ededed] p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button onClick={onBack} className="p-1 hover:bg-gray-200 rounded-full">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <div className="relative">
            <Image
              src={otherUser.avatar}
              alt={otherUser.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            {otherUser.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-600">
              {chat.isTyping ? 'typing...' : otherUser.isOnline ? 'online' : `last seen ${otherUser.lastSeen}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser.id}
            user={message.senderId === currentUser.id ? currentUser : otherUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f0f0] p-4 flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <Smile size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <Paperclip size={20} className="text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="w-full py-3 px-4 rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
          />
        </div>

        {newMessage.trim() ? (
          <button
            onClick={handleSendMessage}
            className="p-2 bg-[#25D366] hover:bg-[#128C7E] rounded-full text-white transition-colors"
          >
            <Send size={20} />
          </button>
        ) : (
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Mic size={20} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}