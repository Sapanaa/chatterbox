// app/servers/[serverId]/channels/[channelId]/page.tsx
import React from "react";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-messasges";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelPage = async ({ params }: ChannelIdPageProps) => {
  const user = await getCurrentUser();
  const {serverId, channelId} = await params

  if (!user) return redirect("/login");

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });

  const member = await prisma.member.findFirst({
    where: {
      userId: user.id,
      serverId: serverId,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex flex-col h-full max-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <ChatHeader serverId={serverId} name={channel.name} type="channel" />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        {/* Messages */}
        <ChatMessage
          member={member}
          name={channel.name}
          chatId={channel.id}
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
          paramKey="channelId"
          paramValue={channel.id}
          type="channel"
        />
      </main>

      <footer className="border-t border-zinc-300 dark:border-zinc-700 px-4 py-3 relative w-full">
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{ channelId: channel.id, serverId: channel.serverId }}
        />
      </footer>
    </div>
  );
};

export default ChannelPage;
