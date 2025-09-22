import {
  API_BASE_URL,
  getConversations as apiGetConversations,
  getConversationById as apiGetConversationById,
  createConversation as apiCreateConversation,
  deleteConversation as apiDeleteConversation,
  getMessages,
  sendMessage as apiSendMessage,
  updateMessageStatus,
  deleteMessage
} from './api';

export interface Message {
  id: string;
  messageId?: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  conversationId?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export class ChatService {
  // Health check
  async checkHealth() {
    try {
      // Simple health check by trying to fetch base URL
      const response = await fetch(API_BASE_URL);
      return { status: 'ok', statusCode: response.status };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Conversations
  async getConversations(page = 1, limit = 20): Promise<Conversation[]> {
    try {
      const response = await apiGetConversations(page, limit) as any;
      // Parse the correct API response structure
      if (response.success && response.data && response.data.conversations) {
        return response.data.conversations.map((conv: any) => ({
          id: conv.conversationId || conv._id,
          conversationId: conv.conversationId,
          participants: conv.participants.map((p: any) => p.userId),
          lastMessage: conv.lastMessage ? {
            id: conv.lastMessage.messageId,
            messageId: conv.lastMessage.messageId,
            conversationId: conv.conversationId,
            senderId: conv.lastMessage.senderId,
            receiverId: '', // Not provided in API response
            content: conv.lastMessage.content,
            messageType: 'text',
            timestamp: conv.lastMessage.timestamp,
            status: 'delivered'
          } : undefined,
          unreadCount: conv.unreadCount || 0,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  async createConversation(participantId: string): Promise<Conversation> {
    try {
      const response = await apiCreateConversation(participantId) as any;
      return response.conversation || response.data;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }

  async getConversationDetails(conversationId: string): Promise<Conversation> {
    try {
      const response = await apiGetConversationById(conversationId) as any;
      return response.conversation || response.data;
    } catch (error) {
      console.error('Failed to get conversation details:', error);
      throw error;
    }
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      // This functionality needs to be implemented on the API side
      console.log('Mark conversation as read:', conversationId);
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
      throw error;
    }
  }

  // Messages
  async sendMessage(messageData: {
    receiverId: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
  }): Promise<Message> {
    try {
      const response = await apiSendMessage({
        receiverId: messageData.receiverId,
        content: messageData.content,
        messageType: messageData.messageType || 'text'
      }) as any;
      return response.message || response.data || response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getConversationMessages(
    conversationId: string,
    page = 1,
    limit = 20
  ): Promise<Message[]> {
    try {
      const response = await getMessages(conversationId, page, limit) as any;
      return response.messages || response.data || [];
    } catch (error) {
      console.error('Failed to get conversation messages:', error);
      throw error;
    }
  }

  // User Status
  async checkUsersStatus(userIds: string[]): Promise<{ [userId: string]: boolean }> {
    try {
      // This functionality needs to be implemented on the API side
      console.log('Check users status:', userIds);
      return {};
    } catch (error) {
      console.error('Failed to check users status:', error);
      throw error;
    }
  }

  async getMyStatus(): Promise<{ isOnline: boolean; lastSeen?: string }> {
    try {
      // This functionality needs to be implemented on the API side
      return { isOnline: true };
    } catch (error) {
      console.error('Failed to get my status:', error);
      throw error;
    }
  }

  async updateActivity(): Promise<void> {
    try {
      // This functionality needs to be implemented on the API side
      console.log('Update activity');
    } catch (error) {
      console.error('Failed to update activity:', error);
      // Don't throw here as this is a heartbeat function
    }
  }

  // Activity heartbeat - call this every 30 seconds
  startActivityHeartbeat() {
    const interval = setInterval(() => {
      this.updateActivity();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }
}

export const chatService = new ChatService();