// lib/api.ts

const API_BASE_URL = 'https://api4.rentlog.thekapslog.com/';
const SOCKET_URL = 'https://api.rentlog.thekapslog.com/';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  GET_CURRENT_USER: '/users/me',
  GET_USERS: '/users',
  GET_USER_BY_ID: '/users/:id',
  UPDATE_USER_STATUS: '/users/status',
  SEARCH_USERS: '/users/search',

  GET_CHATS: '/chats',
  GET_CHAT_BY_ID: '/chats/:id',
  CREATE_CHAT: '/chats',
  DELETE_CHAT: '/chats/:id',

  GET_MESSAGES: '/chats/:chatId/messages',
  SEND_MESSAGE: '/chats/:chatId/messages',
  UPDATE_MESSAGE_STATUS: '/messages/:messageId/status',
  DELETE_MESSAGE: '/messages/:messageId',

  UPLOAD_AVATAR: '/upload/avatar',
  UPLOAD_MESSAGE_FILE: '/upload/message-file',
};

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token')
        : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${
          errorData?.message || 'Unknown error'
        }`
      );
    }

    return await response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Users
  async getCurrentUser() {
    return this.request(API_ENDPOINTS.GET_CURRENT_USER);
  }

  async getUsers() {
    return this.request(API_ENDPOINTS.GET_USERS);
  }

  async getUserById(userId: string) {
    return this.request(API_ENDPOINTS.GET_USER_BY_ID.replace(':id', userId));
  }

  async searchUsers(query: string) {
    return this.request(
      `${API_ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(query)}`
    );
  }

  async updateUserStatus(isOnline: boolean) {
    return this.request(API_ENDPOINTS.UPDATE_USER_STATUS, {
      method: 'PUT',
      body: JSON.stringify({ isOnline }),
    });
  }

  // Chats
  async getChats() {
    return this.request(API_ENDPOINTS.GET_CHATS);
  }

  async getChatById(chatId: string) {
    return this.request(API_ENDPOINTS.GET_CHAT_BY_ID.replace(':id', chatId));
  }

  async createChat(participantIds: string[]) {
    return this.request(API_ENDPOINTS.CREATE_CHAT, {
      method: 'POST',
      body: JSON.stringify({ participantIds }),
    });
  }

  async deleteChat(chatId: string) {
    return this.request(API_ENDPOINTS.DELETE_CHAT.replace(':id', chatId), {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessages(chatId: string, page = 1, limit = 50) {
    return this.request(
      `${API_ENDPOINTS.GET_MESSAGES.replace(
        ':chatId',
        chatId
      )}?page=${page}&limit=${limit}`
    );
  }

  async sendMessage(
    chatId: string,
    messageData: { text: string; type: 'text' | 'image' | 'file'; fileUrl?: string }
  ) {
    return this.request(
      API_ENDPOINTS.SEND_MESSAGE.replace(':chatId', chatId),
      {
        method: 'POST',
        body: JSON.stringify(messageData),
      }
    );
  }

  async updateMessageStatus(messageId: string, status: 'delivered' | 'read') {
    return this.request(
      API_ENDPOINTS.UPDATE_MESSAGE_STATUS.replace(':messageId', messageId),
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  }

  async deleteMessage(messageId: string) {
    return this.request(
      API_ENDPOINTS.DELETE_MESSAGE.replace(':messageId', messageId),
      { method: 'DELETE' }
    );
  }

  // Uploads
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return fetch(`${this.baseURL}${API_ENDPOINTS.UPLOAD_AVATAR}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    }).then((res) => res.json());
  }

  async uploadMessageFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${this.baseURL}${API_ENDPOINTS.UPLOAD_MESSAGE_FILE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    }).then((res) => res.json());
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

export const apiService = new ApiService(API_BASE_URL);

export const SOCKET_CONFIG = {
  url: SOCKET_URL,
  options: {
    transports: ['websocket'],
    autoConnect: false,
  },
};
