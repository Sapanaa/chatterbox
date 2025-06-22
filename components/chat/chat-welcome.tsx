import React from 'react';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  type: "channel" | "conversation";
  name: string;
}

const ChatWelcome = ({ type, name }: ChatMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4 px-4">
      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
        <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400 animate-pulse" />
        <h1 className="text-2xl font-extrabold">
          {type === "channel" ? `Welcome to #${name}` : `Welcome to ${name}`}
        </h1>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
        {type === "channel"
          ? `This is the start of the #${name} channel. Feel free to start the conversation.`
          : `This is the start of your conversation with ${name}. Say hello!`}
      </p>
    </div>
  );
};

export default ChatWelcome;
