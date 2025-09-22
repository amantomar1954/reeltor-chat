// lib/api.ts

// Base API & Socket URLs
export const API_BASE_URL = "https://api4.rentlog.thekapslog.com";
export const SOCKET_URL = "https://api4.rentlog.thekapslog.com";

// REST Endpoints
export const API_ENDPOINTS = {
  // Conversations
  GET_CONVERSATIONS: "/chat-service-v2/v1/api/conversations",
  
  GET_CONVERSATION_BY_ID: (id: string) => `/chat-service-v2/v1/api/conversations/${id}`,
  CREATE_CONVERSATION: "/chat-service-v2/v1/api/conversations",
  DELETE_CONVERSATION: (id: string) => `/chat-service-v2/v1/api/conversations/${id}`,

  // Messages
  GET_MESSAGES: (conversationId: string, page = 1, limit = 20) =>
    `/chat-service-v2/v1/api/messages/conversation/${conversationId}/messages?page=${page}&limit=${limit}`,
  SEND_MESSAGE: "/chat-service-v2/v1/api/messages/send",
  UPDATE_MESSAGE_STATUS: (id: string) => `/chat-service-v2/v1/api/messages/${id}/status`,
  DELETE_MESSAGE: (id: string) => `/chat-service-v2/v1/api/messages/${id}`,

  // Legacy chat endpoints (fallback)
  GET_CHATS: "/chats",
  GET_CHAT_BY_ID: (id: string) => `/chats/${id}`,
  CREATE_CHAT: "/chats",
  DELETE_CHAT: (id: string) => `/chats/${id}`,
};

// Fetch wrapper with proper authentication
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVNTM5OTgxMjc2ODUiLCJuYW1lIjoiQW1hbiBUb21hciIsImlhdCI6MTc1NzUwMzA4NiwiZXhwIjoxNzYwMDk1MDg2fQ.zxNhb6J1Srjkk0NYlCVJ43eQzriFh7UFU6Ei3Qaelg8";

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${
        errorData?.message || "Unknown error"
      }`
    );
  }

  return response.json();
}

// Conversation APIs
export const getConversations = (page = 1, limit = 20) =>
  request(`${API_ENDPOINTS.GET_CONVERSATIONS}?page=${page}&limit=${limit}`);

export const getConversationById = (conversationId: string) =>
  request(API_ENDPOINTS.GET_CONVERSATION_BY_ID(conversationId));

export const createConversation = (participantId: string) =>
  request(API_ENDPOINTS.CREATE_CONVERSATION, {
    method: "POST",
    body: JSON.stringify({ participantId }),
  });

export const deleteConversation = (conversationId: string) =>
  request(API_ENDPOINTS.DELETE_CONVERSATION(conversationId), { method: "DELETE" });

// Legacy Chat APIs (fallback)
export const getChats = () => request(API_ENDPOINTS.GET_CHATS);

export const getChatById = (chatId: string) =>
  request(API_ENDPOINTS.GET_CHAT_BY_ID(chatId));

export const createChat = (participantIds: string[]) =>
  request(API_ENDPOINTS.CREATE_CHAT, {
    method: "POST",
    body: JSON.stringify({ participantIds }),
  });

export const deleteChat = (chatId: string) =>
  request(API_ENDPOINTS.DELETE_CHAT(chatId), { method: "DELETE" });

// Message APIs
export const getMessages = (chatId: string, page = 1, limit = 50) =>
  request(API_ENDPOINTS.GET_MESSAGES(chatId, page, limit));

export const sendMessage = (
  messageData: {
    receiverId: string;
    content: string;
    messageType: "text" | "image" | "file";
    fileUrl?: string
  }
) =>
  request(API_ENDPOINTS.SEND_MESSAGE, {
    method: "POST",
    body: JSON.stringify(messageData),
  });

export const updateMessageStatus = (
  messageId: string,
  status: "delivered" | "read"
) =>
  request(API_ENDPOINTS.UPDATE_MESSAGE_STATUS(messageId), {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const deleteMessage = (messageId: string) =>
  request(API_ENDPOINTS.DELETE_MESSAGE(messageId), { method: "DELETE" });

// Socket Config
export const SOCKET_CONFIG = {
  url: SOCKET_URL,
  options: {
    path: "/chat-service/v0/socket",
    transports: ["polling", "websocket"], // Try polling first
    autoConnect: false, // Manual connection control
    reconnection: false, // Manual reconnection control
    timeout: 10000,
    forceNew: true,
    upgrade: true,
  },
};
