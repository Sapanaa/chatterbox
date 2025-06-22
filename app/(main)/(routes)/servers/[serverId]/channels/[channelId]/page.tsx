// app/servers/[serverId]/channels/[channelId]/page.tsx
import React from "react";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-messasges";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelPage = async ({ params }: ChannelIdPageProps) => {
    const user = await getCurrentUser();

    if(!user) return redirect("/login");

    const channel = await prisma.channel.findUnique({where: {id: params.channelId}});

    const member= await prisma.member.findFirst({
        where: {
            userId: user.id,
            serverId: params.serverId
        }
    })

    if(!channel || !member) return redirect("/");
  return (
    <div>
        <h1>Channel Page</h1>
      <ChatHeader serverId={params.serverId} name={channel.name} type="channel" />

      <div className="flex-1">
        Future messages

      <ChatMessage 
      member={member} name={channel.name} chatId={channel.id} apiUrl="/api/messages" socketUrl="/api/socket/messages" socketQuery={{channelId: channel.id, serverId: channel.serverId}} paramKey="channelId" paramValue={channel.id} type="channel" />

        <ChatInput 
        name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{channelId: channel.id, serverId: channel.serverId}}/>
      </div>
    </div>
  );
};

export default ChannelPage;
