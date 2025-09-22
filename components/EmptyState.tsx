"use client";

import { MessageCircle } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-8 bg-[#d9fdd3] rounded-full flex items-center justify-center">
          <MessageCircle size={64} className="text-[#25D366]" />
        </div>
        <h2 className="text-3xl font-light text-gray-800 mb-4">
          Reeltor.com
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          Send and receive messages without keeping your phone online.<br />
          Use Reeltor Chat on up to 4 linked devices and 1 phone at the same time.
        </p>
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-gray-600">
            🔒 Your personal messages are end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}