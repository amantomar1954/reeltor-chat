"use client";

import { Check, CheckCheck } from 'lucide-react';
import { Message, User } from '@/types/chat';
import Image from 'next/image';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  user: User;
}

export default function MessageBubble({ message, isOwn, user }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check size={16} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={16} className="text-[#25D366]" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwn && (
          <Image
            src={user.avatar}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
          />
        )}
        
        <div
          className={`
            relative px-4 py-2 rounded-lg shadow-sm
            ${isOwn 
              ? 'bg-[#dcf8c6] text-gray-900' 
              : 'bg-white text-gray-900'
            }
          `}
          style={{
            borderRadius: isOwn 
              ? '20px 20px 5px 20px' 
              : '20px 20px 20px 5px'
          }}
        >
          <p className="text-sm leading-relaxed pr-12">
            {message.text}
          </p>
          
          <div className={`
            absolute bottom-1 right-2 flex items-center space-x-1
            ${isOwn ? 'text-gray-500' : 'text-gray-400'}
          `}>
            <span className="text-xs">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
}