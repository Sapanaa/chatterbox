import { Circle, Hash } from 'lucide-react';
import React from 'react';
import MobileToggle from '../mobile-toggle';
import { SocketIndicator } from '../socket-indicator';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
}

const ChatHeader = ({ serverId, name, type }: ChatHeaderProps) => {
  return (
    <header className="flex items-center px-4 h-14 border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <MobileToggle serverId={serverId} />

      {/* Icon based on type */}
      {type === "channel" ? (
        <Hash className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
      ) : (
        <Circle className="w-5 h-5 mr-3 text-green-500 dark:text-green-400" />
      )}

      {/* Channel/Conversation Name */}
      <h1 className="flex-1 font-bold text-2xl truncate text-zinc-900 dark:text-zinc-100">
        {name}
      </h1>

      {/* Socket connection status */}
      <SocketIndicator />
    </header>
  );
};

export default ChatHeader;
