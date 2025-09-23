// "use client";

// import { useState, useRef, useEffect } from 'react';
// import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, Mic } from 'lucide-react';
// import MessageBubble from './MessageBubble';
// import Image from 'next/image';

// const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVNTM5OTgxMjc2ODUiLCJuYW1lIjoiQW1hbiBUb21hciIsImlhdCI6MTc1NzUwMzA4NiwiZXhwIjoxNzYwMDk1MDg2fQ.zxNhb6J1Srjkk0NYlCVJ43eQzriFh7UFU6Ei3Qaelg8";
// const API_BASE_URL = "https://api4.rentlog.thekapslog.com";
// const CURRENT_USER_ID = "U53998127685";

// interface Message {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   text: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read';
//   type: 'text' | 'image' | 'file';
// }

// interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   isOnline: boolean;
//   lastSeen?: string;
// }

// interface Chat {
//   id: string;
//   conversationId?: string;
//   participants: User[];
//   unreadCount?: number;
// }

// interface ChatWindowProps {
//   chat: Chat;
//   onSendMessage: (text: string) => void;
//   onBack?: () => void;
//   isMobile: boolean;
// }

// export default function ChatWindow({ chat, onSendMessage, onBack, isMobile }: ChatWindowProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout>();

//   const otherUser = chat.participants.find(p => p.id !== CURRENT_USER_ID);
//   const currentUser = chat.participants.find(p => p.id === CURRENT_USER_ID) || {
//     id: CURRENT_USER_ID,
//     name: 'You',
//     avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
//     isOnline: true
//   };

//   // Fetch messages from API with multiple endpoint attempts
//   useEffect(() => {
//     if (!chat.conversationId) return;

//     const fetchMessages = async () => {
//       setIsLoading(true);
//       try {
//         let res;
//         const endpoints = [
//           // Try different possible endpoint structures
//           `${API_BASE_URL}/chat-service-v2/v1/api/messages/conversation/${chat.conversationId}`,
//           `${API_BASE_URL}/chat-service-v2/v1/api/messages/${chat.conversationId}?page=1&limit=20`,
//           `${API_BASE_URL}/chat-service/v1/api/messages/conversation/${chat.conversationId}/messages?page=1&limit=20`,
//           `${API_BASE_URL}/api/messages/${chat.conversationId}?page=1&limit=20`
//         ];

//         for (const endpoint of endpoints) {
//           try {
//             console.log(`🔄 Trying endpoint: ${endpoint}`);
//             res = await fetch(endpoint, {
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${API_TOKEN}`
//               }
//             });

//             console.log(res)

//             if (res.ok) {
//               console.log(`✅ Success with endpoint: ${endpoint}`);
//               break;
//             } else if (res.status !== 404) {
//               // If it's not a 404, break and handle the error
//               break;
//             }
//             console.log(`❌ ${endpoint} returned ${res.status}`);
//           } catch (error) {
//             console.log(`❌ ${endpoint} failed with error:`, error);
//           }
//         }

//         if (!res || !res.ok) {
//           const errorText = await res?.text() || 'No valid endpoint found';
//           throw new Error(errorText);
//         }

//         console.log("📤 Final successful endpoint:", res.url);
//         console.log("result", res);

//         const data = await res.json();
//         console.log("📥 API Response Data:", JSON.stringify(data, null, 2));

//         if (data.success && data.data && data.data.messages) {
//           const mappedMessages: Message[] = data.data.messages.map((msg: any) => ({
//             id: msg.messageId || msg._id,
//             senderId: msg.senderId,
//             receiverId: msg.receiverId,
//             text: msg.content,
//             timestamp: new Date(msg.timestamp),
//             status: msg.isRead ? 'read' : msg.isDelivered ? 'delivered' : 'sent',
//             type: msg.messageType
//           }));
//           console.log("✅ Mapped Messages:", mappedMessages);
//           console.log("📊 Total messages count:", mappedMessages.length);
//           setMessages(mappedMessages);
//         } else {
//           console.log("⚠️ No messages found in API response or incorrect data structure");
//           setMessages([]);
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//         setMessages([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [chat.conversationId]);

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     const messageText = newMessage.trim();
//     setNewMessage('');
//     setIsTyping(false);

//     // Get receiver ID (other user in the conversation)
//     const receiverId = otherUser?.id;
//     if (!receiverId) {
//       console.error('No receiver ID found');
//       return;
//     }

//     try {
//       // Detect message type based on content
//       let messageType = "text";

//       // Check if message contains image URLs or file extensions
//       const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
//       const fileExtensions = /\.(pdf|doc|docx|txt|zip|rar|mp4|mp3|avi)$/i;
//       const urlPattern = /(https?:\/\/[^\s]+)/g;

//       if (urlPattern.test(messageText)) {
//         if (imageExtensions.test(messageText)) {
//           messageType = "image";
//         } else if (fileExtensions.test(messageText)) {
//           messageType = "file";
//         }
//       }

//       // Prepare the message data for API
//       const messageData = {
//         receiverId: receiverId,
//         content: messageText,
//         messageType: messageType
//       };

//       console.log('📤 Sending message:', messageData);
//       console.log('📎 Detected message type:', messageType);

//       // Send message to API
//       const response = await fetch(`${API_BASE_URL}/chat-service-v2/v1/api/messages/send`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${API_TOKEN}`
//         },
//         body: JSON.stringify(messageData)
//       });

//       console.log('📤 Send message response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Failed to send message:', errorText);
//         throw new Error(errorText);
//       }

//       const responseData = await response.json();
//       console.log('✅ Message sent successfully:', responseData);

//       // Add the message to local state immediately for better UX
//       const newLocalMessage: Message = {
//         id: responseData.messageId || `temp-${Date.now()}`,
//         senderId: CURRENT_USER_ID,
//         receiverId: receiverId,
//         text: messageText,
//         timestamp: new Date(),
//         status: 'sent',
//         type: 'text'
//       };

//       setMessages(prevMessages => [...prevMessages, newLocalMessage]);

//       // Also call the parent onSendMessage if needed
//       onSendMessage(messageText);

//     } catch (error) {
//       console.error('❌ Error sending message:', error);
//       // In case of error, still add to local state for demo purposes
//       const errorMessage: Message = {
//         id: `error-${Date.now()}`,
//         senderId: CURRENT_USER_ID,
//         receiverId: receiverId,
//         text: messageText,
//         timestamp: new Date(),
//         status: 'sent',
//         type: 'text'
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewMessage(e.target.value);

//     const typing = e.target.value.length > 0;
//     if (typing !== isTyping) setIsTyping(typing);

//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     if (typing) {
//       typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (!otherUser) return null;

//   return (
//     <div className="flex flex-col h-full bg-[#e5ddd5]">
//       {/* Header */}
//       <div className="bg-[#ededed] p-4 flex items-center justify-between border-b">
//         <div className="flex items-center space-x-3">
//           {isMobile && (
//             <button onClick={onBack} className="p-1 hover:bg-gray-200 rounded-full">
//               <ArrowLeft size={20} className="text-gray-600" />
//             </button>
//           )}
//           <Image
//             src={otherUser.avatar}
//             alt={otherUser.name}
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <div>
//             <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
//             <p className="text-sm text-gray-600">
//               {isTyping ? 'typing...' : otherUser.isOnline ? 'online' : `last seen ${otherUser.lastSeen || 'recently'}`}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button className="p-2 hover:bg-gray-200 rounded-full"><Video size={20} className="text-gray-600" /></button>
//           <button className="p-2 hover:bg-gray-200 rounded-full"><Phone size={20} className="text-gray-600" /></button>
//           <button className="p-2 hover:bg-gray-200 rounded-full"><MoreVertical size={20} className="text-gray-600" /></button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {(() => {
//           console.log('🎨 Rendering messages:', { isLoading, messagesCount: messages.length, messages });
//           return null;
//         })()}
//         {isLoading ? (
//           <div className="flex items-center justify-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="flex items-center justify-center h-32 text-gray-500">
//             No messages yet. Start the conversation!
//           </div>
//         ) : (
//           messages.map(msg => (
//             <MessageBubble
//               key={msg.id}
//               message={msg}
//               isOwn={msg.senderId === CURRENT_USER_ID}
//               user={msg.senderId === CURRENT_USER_ID ? currentUser : otherUser}
//             />
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="bg-[#f0f0f0] p-4 flex items-center space-x-3">
//         <button className="p-2 hover:bg-gray-200 rounded-full"><Smile size={20} className="text-gray-600" /></button>
//         <button className="p-2 hover:bg-gray-200 rounded-full"><Paperclip size={20} className="text-gray-600" /></button>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message"
//           className="flex-1 py-3 px-4 rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
//         />
//         {newMessage.trim() ? (
//           <button onClick={handleSendMessage} className="p-2 bg-[#25D366] hover:bg-[#128C7E] rounded-full text-white">
//             <Send size={20} />
//           </button>
//         ) : (
//           <button className="p-2 hover:bg-gray-200 rounded-full"><Mic size={20} className="text-gray-600" /></button>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, Mic } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Image from 'next/image';

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVNTM5OTgxMjc2ODUiLCJuYW1lIjoiQW1hbiBUb21hciIsImlhdCI6MTc1NzUwMzA4NiwiZXhwIjoxNzYwMDk1MDg2fQ.zxNhb6J1Srjkk0NYlCVJ43eQzriFh7UFU6Ei3Qaelg8";
const API_BASE_URL = "https://api4.rentlog.thekapslog.com";
const CURRENT_USER_ID = "U53998127685";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
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
  unreadCount?: number;
}

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
  onBack?: () => void;
  isMobile: boolean;
}

export default function ChatWindow({ chat, onSendMessage, onBack, isMobile }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationData, setConversationData] = useState<any>(null); // State to store conversation data

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const otherUser = chat.participants.find(p => p.id !== CURRENT_USER_ID);
  const currentUser = chat.participants.find(p => p.id === CURRENT_USER_ID) || {
    id: CURRENT_USER_ID,
    name: 'You',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    isOnline: true
  };

  // Function to fetch conversation data
  const fetchConversationData = async (conversationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-service-v2/v1/api/conversations/${conversationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch conversation data: ${errorText}`);
      }

      const data = await response.json();
      console.log("Conversation API Response Data:", data);
      setConversationData(data); // Store the conversation data in state
    } catch (error) {
      console.error('Error fetching conversation data:', error);
    }
  };

  // Fetch conversation data when the component mounts or when the chat.conversationId changes
  useEffect(() => {
    if (chat.conversationId) {
      fetchConversationData(chat.conversationId);
    }
  }, [chat.conversationId]);

  // Fetch messages from API with multiple endpoint attempts
  useEffect(() => {
    if (!chat.conversationId) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        let res;
        const endpoints = [
          // Try different possible endpoint structures
          `${API_BASE_URL}/chat-service-v2/v1/api/messages/conversation/${chat.conversationId}`,
          `${API_BASE_URL}/chat-service-v2/v1/api/messages/${chat.conversationId}?page=1&limit=20`,
          `${API_BASE_URL}/chat-service/v1/api/messages/conversation/${chat.conversationId}/messages?page=1&limit=20`,
          `${API_BASE_URL}/api/messages/${chat.conversationId}?page=1&limit=20`
        ];

        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            res = await fetch(endpoint, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
              }
            });

            console.log(res)

            if (res.ok) {
              console.log(`✅ Success with endpoint: ${endpoint}`);
              break;
            } else if (res.status !== 404) {
              // If it's not a 404, break and handle the error
              break;
            }
            console.log(`❌ ${endpoint} returned ${res.status}`);
          } catch (error) {
            console.log(`❌ ${endpoint} failed with error:`, error);
          }
        }

        if (!res || !res.ok) {
          const errorText = await res?.text() || 'No valid endpoint found';
          throw new Error(errorText);
        }

        console.log("📤 Final successful endpoint:", res.url);
        console.log("result", res);

        const data = await res.json();
        console.log("📥 API Response Data:", JSON.stringify(data, null, 2));

        if (data.success && data.data && data.data.messages) {
          const mappedMessages: Message[] = data.data.messages.map((msg: any) => ({
            id: msg.messageId || msg._id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.content,
            timestamp: new Date(msg.timestamp),
            status: msg.isRead ? 'read' : msg.isDelivered ? 'delivered' : 'sent',
            type: msg.messageType
          }));
          console.log("✅ Mapped Messages:", mappedMessages);
          console.log("📊 Total messages count:", mappedMessages.length);
          setMessages(mappedMessages);
        } else {
          console.log("⚠️ No messages found in API response or incorrect data structure");
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chat.conversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsTyping(false);

    // Get receiver ID (other user in the conversation)
    const receiverId = otherUser?.id;
    if (!receiverId) {
      console.error('No receiver ID found');
      return;
    }

    try {
      // Detect message type based on content
      let messageType = "text";

      // Check if message contains image URLs or file extensions
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      const fileExtensions = /\.(pdf|doc|docx|txt|zip|rar|mp4|mp3|avi)$/i;
      const urlPattern = /(https?:\/\/[^\s]+)/g;

      if (urlPattern.test(messageText)) {
        if (imageExtensions.test(messageText)) {
          messageType = "image";
        } else if (fileExtensions.test(messageText)) {
          messageType = "file";
        }
      }

      // Prepare the message data for API
      const messageData = {
        receiverId: receiverId,
        content: messageText,
        messageType: messageType
      };

      console.log('📤 Sending message:', messageData);
      console.log('📎 Detected message type:', messageType);

      // Send message to API
      const response = await fetch(`${API_BASE_URL}/chat-service-v2/v1/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(messageData)
      });

      console.log('📤 Send message response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to send message:', errorText);
        throw new Error(errorText);
      }

      const responseData = await response.json();
      console.log('✅ Message sent successfully:', responseData);

      // Add the message to local state immediately for better UX
      const newLocalMessage: Message = {
        id: responseData.messageId || `temp-${Date.now()}`,
        senderId: CURRENT_USER_ID,
        receiverId: receiverId,
        text: messageText,
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      };

      setMessages(prevMessages => [...prevMessages, newLocalMessage]);

      // Also call the parent onSendMessage if needed
      onSendMessage(messageText);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      // In case of error, still add to local state for demo purposes
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        senderId: CURRENT_USER_ID,
        receiverId: receiverId,
        text: messageText,
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    const typing = e.target.value.length > 0;
    if (typing !== isTyping) setIsTyping(typing);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (typing) {
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!otherUser) return null;

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5]">
      {/* Header */}
      <div className="bg-[#ededed] p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button onClick={onBack} className="p-1 hover:bg-gray-200 rounded-full">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <Image
            src={otherUser.avatar}
            alt={otherUser.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-600">
              {isTyping ? 'typing...' : otherUser.isOnline ? 'online' : `last seen ${otherUser.lastSeen || 'recently'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full"><Video size={20} className="text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full"><Phone size={20} className="text-gray-600" /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full"><MoreVertical size={20} className="text-gray-600" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {(() => {
          console.log('🎨 Rendering messages:', { isLoading, messagesCount: messages.length, messages });
          return null;
        })()}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === CURRENT_USER_ID}
              user={msg.senderId === CURRENT_USER_ID ? currentUser : otherUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-[#f0f0f0] p-4 flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-200 rounded-full"><Smile size={20} className="text-gray-600" /></button>
        <button className="p-2 hover:bg-gray-200 rounded-full"><Paperclip size={20} className="text-gray-600" /></button>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="flex-1 py-3 px-4 rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
        />
        {newMessage.trim() ? (
          <button onClick={handleSendMessage} className="p-2 bg-[#25D366] hover:bg-[#128C7E] rounded-full text-white">
            <Send size={20} />
          </button>
        ) : (
          <button className="p-2 hover:bg-gray-200 rounded-full"><Mic size={20} className="text-gray-600" /></button>
        )}
      </div>
    </div>
  );
}