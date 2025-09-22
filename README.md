# WhatsApp Clone - API Integration Guide

This WhatsApp clone is built with Next.js, Tailwind CSS, and Socket.io. Below are the API integration points you need to implement.

## 🚀 Quick Start

1. Copy `.env.example` to `.env.local` and update with your API endpoints
2. Replace mock implementations with real API calls
3. Set up your Socket.io server
4. Update authentication flow

## 📡 API Endpoints to Implement

### Authentication APIs
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token

### User Management APIs
- `GET /users/me` - Get current user profile
- `GET /users` - Get all users (for chat creation)
- `GET /users/:id` - Get user by ID
- `PUT /users/status` - Update user online status
- `GET /users/search?q=query` - Search users

### Chat Management APIs
- `GET /chats` - Get user's chats
- `GET /chats/:id` - Get specific chat details
- `POST /chats` - Create new chat
- `DELETE /chats/:id` - Delete chat

### Message APIs
- `GET /chats/:chatId/messages` - Get chat messages (with pagination)
- `POST /chats/:chatId/messages` - Send new message
- `PUT /messages/:messageId/status` - Update message status (delivered/read)
- `DELETE /messages/:messageId` - Delete message

### File Upload APIs
- `POST /upload/avatar` - Upload user avatar
- `POST /upload/message-file` - Upload message attachments

## 🔌 Socket.io Events

### Client to Server Events
- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a message
- `typing` - Send typing indicator
- `update_status` - Update online status

### Server to Client Events
- `message` - Receive new message
- `typing` - Receive typing indicator
- `user_status` - User online/offline status update
- `message_status` - Message delivery/read status update

## 🔧 Files to Update

### 1. API Service (`lib/api.ts`)
Replace all TODO comments with actual API implementations:

```typescript
// Example: Replace mock login with real API
async login(email: string, password: string) {
  return this.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
```

### 2. Socket Hook (`hooks/useSocket.ts`)
Uncomment the real Socket.io implementation and remove mock:

```typescript
// Replace mock socket with real connection
const socket = io(SOCKET_CONFIG.url, {
  ...SOCKET_CONFIG.options,
  auth: {
    userId: userId,
    token: localStorage.getItem('auth_token'),
  },
});
```

### 3. Mock Data (`lib/mockData.ts`)
Replace mock functions with API calls:

```typescript
export const fetchChats = async (): Promise<Chat[]> => {
  return await apiService.getChats(); // Replace mock implementation
};
```

### 4. Main App (`app/page.tsx`)
Update data loading and socket event handlers:

```typescript
// Replace mock data loading with real API calls
const userChats = await fetchChats();
```

## 🗄️ Database Schema

You'll need these main tables/collections:

### Users
```sql
- id (primary key)
- name
- email
- password_hash
- avatar_url
- is_online
- last_seen
- created_at
- updated_at
```

### Chats
```sql
- id (primary key)
- type (direct/group)
- name (for group chats)
- created_by
- created_at
- updated_at
```

### Chat Participants
```sql
- chat_id (foreign key)
- user_id (foreign key)
- joined_at
- role (admin/member for groups)
```

### Messages
```sql
- id (primary key)
- chat_id (foreign key)
- sender_id (foreign key)
- text
- type (text/image/file)
- file_url
- status (sent/delivered/read)
- created_at
- updated_at
```

## 🔐 Authentication Flow

1. User logs in via `/auth/login`
2. Server returns JWT token
3. Client stores token in localStorage
4. Token is sent with all API requests
5. Socket.io connection includes token for authentication

## 📱 Real-time Features

### Message Status Updates
- Message sent: Client shows single check
- Message delivered: Server confirms delivery (double check)
- Message read: Recipient opens chat (blue double check)

### Typing Indicators
- Send typing event when user starts typing
- Stop typing after 3 seconds of inactivity
- Show "typing..." in chat list and chat window

### Online Status
- Update status when user connects/disconnects
- Show green dot for online users
- Display "last seen" for offline users

## 🚀 Deployment Checklist

- [ ] Set up production API server
- [ ] Configure Socket.io server with CORS
- [ ] Set up file upload service (AWS S3, Cloudinary, etc.)
- [ ] Configure environment variables
- [ ] Set up database with proper indexes
- [ ] Implement rate limiting
- [ ] Add error handling and logging
- [ ] Set up SSL certificates
- [ ] Configure CDN for file uploads

## 🔍 Testing

Test these scenarios:
- [ ] User registration and login
- [ ] Real-time message sending/receiving
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] File uploads
- [ ] Message status updates
- [ ] Mobile responsiveness
- [ ] Socket reconnection handling

## 📞 Support

For implementation help, check the TODO comments throughout the codebase. Each comment indicates exactly what needs to be replaced with your API implementation.