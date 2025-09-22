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

import { useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_CONFIG } from "@/lib/api";

export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 🔹 Static token (hardcoded for now)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVNTM5OTgxMjc2ODUiLCJuYW1lIjoiQW1hbiBUb21hciIsImlhdCI6MTc1NzUwMzA4NiwiZXhwIjoxNzYwMDk1MDg2fQ.zxNhb6J1Srjkk0NYlCVJ43eQzriFh7UFU6Ei3Qaelg8";

    const socket = io(SOCKET_CONFIG.url, {
      path: "/chat-service/v0/socket",
      transports: ["websocket"],
      auth: {
        userId,
        token: `Bearer ${token}`,// directly passing static token
      },
    });

    socket.connect();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Socket connection error:", error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Chat Actions
  const joinChat = useCallback((chatId: string) => {
    socketRef.current?.emit("join_chat", { chatId });
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    socketRef.current?.emit("leave_chat", { chatId });
  }, []);

  const sendMessage = useCallback((messageData: any) => {
    socketRef.current?.emit("send_message", messageData);
  }, []);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    socketRef.current?.emit("typing", { chatId, isTyping });
  }, []);

  const updateOnlineStatus = useCallback((isOnline: boolean) => {
    socketRef.current?.emit("update_status", { isOnline });
  }, []);

  return {
    socket: socketRef.current,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    updateOnlineStatus,
  };
};