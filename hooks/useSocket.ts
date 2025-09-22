// "use client";

// import { useEffect, useRef, useCallback } from 'react';
// import io, { Socket } from 'socket.io-client';
// import { SOCKET_CONFIG } from '@/lib/api';

// export const useSocket = (userId?: string) => {
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     // TODO: REPLACE THIS MOCK IMPLEMENTATION WITH REAL SOCKET.IO CONNECTION
//     // Uncomment the lines below and remove the mock implementation when you have a real socket server
    
    
//     // REAL SOCKET.IO IMPLEMENTATION - UNCOMMENT WHEN READY
//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVNTM5OTgxMjc2ODUiLCJuYW1lIjoiQW1hbiBUb21hciIsImlhdCI6MTc1NzUwMzA4NiwiZXhwIjoxNzYwMDk1MDg2fQ.zxNhb6J1Srjkk0NYlCVJ43eQzriFh7UFU6Ei3Qaelg8";
//     const socket = io(SOCKET_CONFIG.url, {
//       ...SOCKET_CONFIG.options,
//       auth: {
//         userId: userId,
//         token: `Bearer ${token}`,
//       },
//     });

//     socket.connect();
//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('Connected to socket server');
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from socket server');
//     });

//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//     });

//     return () => {
//       socket.disconnect();
//     };
    

//     // MOCK SOCKET IMPLEMENTATION - REMOVE WHEN USING REAL SOCKET
//     const mockSocket = createMockSocket();

//     socketRef.current = mockSocket as any;

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [userId]);

//   // TODO: REPLACE MOCK FUNCTIONS WITH REAL SOCKET METHODS
//   const joinChat = useCallback((chatId: string) => {
//     // IMPLEMENT: Join a specific chat room
//     if (socketRef.current) {
//       socketRef.current.emit('join_chat', { chatId });
//     }
//   }, []);

//   const leaveChat = useCallback((chatId: string) => {
//     // IMPLEMENT: Leave a specific chat room
//     if (socketRef.current) {
//       socketRef.current.emit('leave_chat', { chatId });
//     }
//   }, []);

//   const sendMessage = useCallback((messageData: any) => {
//     // IMPLEMENT: Send message through socket
//     if (socketRef.current) {
//       socketRef.current.emit('send_message', messageData);
//     }
//   }, []);

//   const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
//     // IMPLEMENT: Send typing indicator
//     if (socketRef.current) {
//       socketRef.current.emit('typing', { chatId, isTyping });
//     }
//   }, []);

//   const updateOnlineStatus = useCallback((isOnline: boolean) => {
//     // IMPLEMENT: Update user online status
//     if (socketRef.current) {
//       socketRef.current.emit('update_status', { isOnline });
//     }
//   }, []);

//   return {
//     socket: socketRef.current,
//     joinChat,
//     leaveChat,
//     sendMessage,
//     sendTyping,
//     updateOnlineStatus,
//   };
// };

// // MOCK SOCKET IMPLEMENTATION - REMOVE WHEN USING REAL SOCKET
// function createMockSocket() {
//   return {
//     on: (event: string, callback: Function) => {
//       // Simulate random events for demo
//       if (event === 'message') {
//         const interval = setInterval(() => {
//           if (Math.random() > 0.7) {
//             callback({
//               id: Date.now().toString(),
//               senderId: Math.random() > 0.5 ? '2' : '3',
//               receiverId: '1',
//               text: ['Hey!', 'How are you?', 'What\'s up?', '👋'][Math.floor(Math.random() * 4)],
//               timestamp: new Date(),
//               status: 'delivered',
//               type: 'text',
//             });
//           }
//         }, 5000);
//         return () => clearInterval(interval);
//       }
      
//       if (event === 'typing') {
//         const interval = setInterval(() => {
//           if (Math.random() > 0.8) {
//             callback({
//               chatId: `chat-${Math.random() > 0.5 ? '2' : '3'}`,
//               userId: Math.random() > 0.5 ? '2' : '3',
//               isTyping: true,
//             });
//             setTimeout(() => {
//               callback({
//                 chatId: `chat-${Math.random() > 0.5 ? '2' : '3'}`,
//                 userId: Math.random() > 0.5 ? '2' : '3',
//                 isTyping: false,
//               });
//             }, 3000);
//           }
//         }, 8000);
//         return () => clearInterval(interval);
//       }
//     },
//     emit: (event: string, data: any) => {
//       console.log('Mock Socket emit:', event, data);
//     },
//     disconnect: () => {
//       console.log('Mock Socket disconnected');
//     },
//   };
// }
"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export const useSocket = (userId?: string) => {
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!userId) return;

    // Since the real socket server is not available, create a mock implementation
    const createMockSocket = () => {
      const mockSocket = {
        on: (_event: string, _callback: Function) => {
          // Store event listeners
          return mockSocket;
        },
        emit: (event: string, data: any) => {
          console.log(`📡 Socket emit: ${event}`, data);
          return mockSocket;
        },
        connect: () => {
          console.log("🔌 Attempting to connect...");
          // Simulate successful connection after a short delay
          setTimeout(() => {
            console.log("✅ Connected to socket server (mock)");
            setIsConnected(true);
            setConnectionError(null);
            reconnectAttempts.current = 0;
          }, 1000);
          return mockSocket;
        },
        disconnect: () => {
          console.log("🔌 Disconnected from socket server");
          setIsConnected(false);
          return mockSocket;
        },
        removeAllListeners: () => {
          return mockSocket;
        }
      };
      return mockSocket;
    };

    // Create and setup mock socket
    const mockSocket = createMockSocket();
    socketRef.current = mockSocket as any;

    // Start connection
    mockSocket.connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    setConnectionError(null);
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  // Join conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit("join_conversation", { conversationId });
    }
  }, [isConnected]);

  
  // Leave conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit("leave_conversation", { conversationId });
    }
  }, [isConnected]);

  // Typing indicators
  const startTyping = useCallback((conversationId: string) => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit("typing_start", { conversationId });
      
    }
  }, [isConnected]);

  const stopTyping = useCallback((conversationId: string) => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit("typing_stop", { conversationId });
    }
  }, [isConnected]);

  // Mark message as read
  const markMessageAsRead = useCallback((messageId: string, conversationId: string) => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit("message_read", { messageId, conversationId });
    }
  }, [isConnected]);

  // Legacy methods for backward compatibility
  const joinChat = useCallback((chatId: string) => {
    joinConversation(chatId);
  }, [joinConversation]);

  const leaveChat = useCallback((chatId: string) => {
    leaveConversation(chatId);
  }, [leaveConversation]);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (isTyping) {
      startTyping(chatId);
    } else {
      stopTyping(chatId);
    }
  }, [startTyping, stopTyping]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    reconnect,
    // New API methods
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markMessageAsRead,
    // Legacy methods for backward compatibility
    joinChat,
    leaveChat,
    sendTyping,
  };
};
