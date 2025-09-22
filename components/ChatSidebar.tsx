"use client";

import { useState,useEffect } from 'react';
import { Search, Menu, MoreVertical, MessageCircle } from 'lucide-react';
import { Chat, User } from '@/types/chat';
import { currentUser, searchUsers } from '@/lib/mockData';
import Image from 'next/image';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat?: Chat;
  onChatSelect: (chat: Chat) => void;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({ 
  chats, 
  selectedChat, 
  onChatSelect, 
  isMobile, 
  isOpen, 
  onToggle 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // TODO: IMPLEMENT REAL SEARCH WITH DEBOUNCING
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          // TODO: REPLACE WITH REAL API CALL
          const results = await searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const filteredChats = searchQuery.trim() 
    ? chats.filter(chat =>
        chat.participants.some(p => 
          p.id !== currentUser.id && 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : chats;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (isMobile && !isOpen) return null;

  return (
    <div className={`
      ${isMobile 
        ? 'fixed inset-0 z-50 bg-white' 
        : 'w-80 border-r border-gray-200 bg-white'
      }
      flex flex-col h-full
    `}>
      {/* Header */}
      <div className="bg-[#ededed] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          {isMobile && (
            <h1 className="text-lg font-medium">WhatsApp</h1>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MessageCircle size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
          {isMobile && (
            <button onClick={onToggle} className="p-2 hover:bg-gray-200 rounded-full">
              <Menu size={20} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-white border-b">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#25D366]"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#25D366]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Results */}
        {searchQuery.trim() && searchResults.length > 0 && (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="px-4 py-2 text-sm text-gray-600 font-medium">
              Search Results
            </div>
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  // TODO: IMPLEMENT - Create new chat with user
                  console.log('Start chat with:', user.name);
                }}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    {user.isOnline ? 'Online' : `Last seen ${user.lastSeen}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Existing Chats */}
        {filteredChats.map((chat) => {
          const otherUser = chat.participants.find(p => p.id !== currentUser.id);
          if (!otherUser) return null;

          return (
            <div
              key={chat.id}
              onClick={() => {
                onChatSelect(chat);
                if (isMobile) onToggle();
              }}
              className={`
                flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100
                ${selectedChat?.id === chat.id ? 'bg-[#e9f7fe]' : ''}
              `}
            >
              <div className="relative">
                <Image
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                {otherUser.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 ml-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {otherUser.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.isTyping ? (
                      <span className="text-[#25D366]">typing...</span>
                    ) : (
                      chat.lastMessage?.text || 'No messages yet'
                    )}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[#25D366] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {searchQuery.trim() && filteredChats.length === 0 && searchResults.length === 0 && !isSearching && (
          <div className="p-8 text-center text-gray-500">
            <p>No chats found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}