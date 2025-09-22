"use client";

interface ConnectionStatusProps {
  isConnected: boolean;
  connectionError?: string | null;
  onReconnect?: () => void;
}

export default function ConnectionStatus({
  isConnected,
  connectionError,
  onReconnect,
}: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 bg-green-50 border-b border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Connected</span>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex items-center justify-between px-3 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span>Connection failed: {connectionError}</span>
        </div>
        {onReconnect && (
          <button
            onClick={onReconnect}
            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-600 bg-yellow-50 border-b border-yellow-200">
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      <span>Connecting...</span>
    </div>
  );
}