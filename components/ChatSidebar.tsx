"use client";

import { useState, useEffect } from 'react';
import { Search, Menu, MoreVertical, MessageCircle } from 'lucide-react';
import Image from 'next/image';

// Static token and API configuration
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVNTM5OTgxMjc2ODUiLCJuYW1lIjoiQW1hbiBUb21hciIsImlhdCI6MTc1NzUwMzA4NiwiZXhwIjoxNzYwMDk1MDg2fQ.zxNhb6J1Srjkk0NYlCVJ43eQzriFh7UFU6Ei3Qaelg8";
const API_BASE_URL = "https://api4.rentlog.thekapslog.com";
const CURRENT_USER_ID = "U53998127685";

interface Participant {
  userId: string;
  userName: string;
  _id: string;
  joinedAt: string;
  lastSeenAt: string;
}

interface LastMessage {
  messageId: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  messageCount: number;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: LastMessage;
  unreadCount: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Chat {
  id: string;
  conversationId?: string;
  participants: User[];
  unreadCount: number;
  lastMessage?: {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file';
  };
}

interface ChatSidebarProps {
  selectedChat?: Chat;
  onChatSelect: (chat: Chat) => void;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({
  selectedChat,
  onChatSelect,
  isMobile,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/chat-service-v2/v1/api/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
          },
        });

        console.log('API Response Status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch conversations: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response Data:', data);

        if (data.success && data.data && data.data.conversations) {
          // Convert conversations to Chat objects with proper User participants
          const convertedChats: Chat[] = data.data.conversations.map((conv: Conversation) => {
            // Get current user participant
            const currentUserParticipant = conv.participants.find(p => p.userId === CURRENT_USER_ID);

            // Get other participant
            const otherUserParticipant = conv.participants.find(p => p.userId !== CURRENT_USER_ID);

            const participants: User[] = [];

            // Add current user
            if (currentUserParticipant) {
              participants.push({
                id: currentUserParticipant.userId,
                name: currentUserParticipant.userName,
                avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
                isOnline: true
              });
            }

            // Add other user
            if (otherUserParticipant) {
              participants.push({
                id: otherUserParticipant.userId,
                name: otherUserParticipant.userName,
                avatar: getAvatarUrl(otherUserParticipant.userName),
                isOnline: true // You can update this based on lastSeenAt if needed
              });
            }

            const chat: Chat = {
              id: conv.conversationId,
              conversationId: conv.conversationId,
              participants,
              unreadCount: conv.unreadCount || 0,
              lastMessage: conv.lastMessage ? {
                id: conv.lastMessage.messageId,
                senderId: conv.lastMessage.senderId,
                receiverId: participants.find(p => p.id !== conv.lastMessage.senderId)?.id || '',
                text: conv.lastMessage.content,
                timestamp: new Date(conv.lastMessage.timestamp),
                status: 'delivered' as const,
                type: 'text' as const
              } : undefined
            };

            return chat;
          });

          setChats(convertedChats);
          console.log('✅ Loaded conversations:', convertedChats);
        } else {
          setChats([]);
        }
      } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredChats = searchQuery
    ? chats.filter(chat => {
        const otherParticipant = chat.participants.find(p => p.id !== CURRENT_USER_ID);
        return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : chats;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes}m` : 'now';
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p.id !== CURRENT_USER_ID) || chat.participants[0];
  };

  const getAvatarUrl = (userName: string) => {
    // Generate different avatars based on user name
    const avatars = [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    ];
    const index = userName.length % avatars.length;
    return avatars[index];
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <div className="flex items-center space-x-2">
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            const isSelected = selectedChat?.conversationId === chat.conversationId;

            return (
              <div
                key={chat.conversationId}
                onClick={() => onChatSelect(chat)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={otherParticipant.avatar}
                    alt={otherParticipant.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* Chat Info */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {otherParticipant.name}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(chat.lastMessage.timestamp.toISOString())}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">
                      {chat.lastMessage ? (
                        <>
                          {chat.lastMessage.senderId === CURRENT_USER_ID && (
                            <span className="text-gray-500">You: </span>
                          )}
                          {chat.lastMessage.text}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">No messages yet</span>
                      )}
                    </p>

                    {/* Unread Count */}
                    {chat.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Message Count */}
                  <p className="text-xs text-gray-400 mt-1">
                    {/* You can add message count if available in API */}
                    Chat
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}