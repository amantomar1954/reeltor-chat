// TODO: REPLACE ALL MOCK DATA WITH REAL API CALLS
// This file contains mock data for development/demo purposes
// Replace these functions with actual API calls to your backend

import { User, Message, Chat } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { apiService } from './api';

// TODO: REPLACE WITH API CALL - apiService.getCurrentUser()
export const currentUser: User = {
  id: '1',
  name: 'You',
  avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
  isOnline: true,
};

// TODO: REPLACE WITH API CALL - apiService.getUsers()
export const mockUsers: User[] = [
  {
    id: '2',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Bob Smith',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    isOnline: false,
    lastSeen: '2 hours ago',
  },
  {
    id: '4',
    name: 'Carol Williams',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    isOnline: true,
  },
  {
    id: '5',
    name: 'David Brown',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    isOnline: false,
    lastSeen: 'yesterday',
  },
  {
    id: '6',
    name: 'Eva Davis',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    isOnline: true,
  },
];

// TODO: REPLACE WITH API CALL - apiService.getMessages(chatId)
export const generateMockMessages = (chatId: string, participants: User[]): Message[] => {
  const messages: Message[] = [];
  const sampleTexts = [
    "Hey! How are you doing?",
    "I'm good, thanks! How about you?",
    "Great! Want to grab coffee later?",
    "Sure! What time works for you?",
    "How about 3 PM?",
    "Perfect! See you then 😊",
    "Looking forward to it!",
    "Have a great day!",
    "You too! Talk soon",
    "Did you see the news today?",
    "Yeah, quite interesting!",
    "What do you think about it?",
    "I think it's a good development",
    "Agreed! Hope it goes well",
    "Definitely! 👍",
  ];

  for (let i = 0; i < 15; i++) {
    const isFromCurrentUser = Math.random() > 0.5;
    const sender = isFromCurrentUser ? currentUser : participants.find(p => p.id !== currentUser.id)!;
    const receiver = isFromCurrentUser ? participants.find(p => p.id !== currentUser.id)! : currentUser;
    
    messages.push({
      id: uuidv4(),
      senderId: sender.id,
      receiverId: receiver.id,
      text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
      timestamp: new Date(Date.now() - (15 - i) * 60000 * Math.random() * 60),
      status: Math.random() > 0.3 ? 'read' : Math.random() > 0.5 ? 'delivered' : 'sent',
      type: 'text',
    });
  }

  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// TODO: REPLACE WITH API CALL - apiService.getChats()
export const generateMockChats = (): Chat[] => {
  return mockUsers.map(user => {
    const participants = [currentUser, user];
    const messages = generateMockMessages(`chat-${user.id}`, participants);
    const lastMessage = messages[messages.length - 1];
    
    return {
      id: `chat-${user.id}`,
      participants,
      lastMessage,
      unreadCount: Math.floor(Math.random() * 5),
    };
  });
};

// TODO: IMPLEMENT REAL API FUNCTIONS
// Replace these mock functions with actual API calls

export const fetchCurrentUser = async (): Promise<User> => {
  // TODO: REPLACE WITH REAL API CALL
  // return await apiService.getCurrentUser();
  return currentUser;
};

export const fetchUsers = async (): Promise<User[]> => {
  // TODO: REPLACE WITH REAL API CALL
  // return await apiService.getUsers();
  return mockUsers;
};

export const fetchChats = async (): Promise<Chat[]> => {
  // TODO: REPLACE WITH REAL API CALL
  // return await apiService.getChats();
  return generateMockChats();
};

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  // TODO: REPLACE WITH REAL API CALL
  // return await apiService.getMessages(chatId);
  const chat = generateMockChats().find(c => c.id === chatId);
  if (!chat) return [];
  return generateMockMessages(chatId, chat.participants);
};

export const sendMessageToAPI = async (chatId: string, messageData: {
  text: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}): Promise<Message> => {
  // TODO: REPLACE WITH REAL API CALL
  // return await apiService.sendMessage(chatId, messageData);
  
  // Mock implementation
  return {
    id: uuidv4(),
    senderId: currentUser.id,
    receiverId: chatId.replace('chat-', ''),
    text: messageData.text,
    timestamp: new Date(),
    status: 'sent',
    type: messageData.type,
  };
};

export const searchUsers = async (query: string): Promise<User[]> => {
  // TODO: REPLACE WITH REAL API CALL
  // return await apiService.searchUsers(query);
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase())
  );
};