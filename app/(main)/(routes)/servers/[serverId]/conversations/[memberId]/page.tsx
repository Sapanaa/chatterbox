import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/current-user'
import prisma from '@/lib/prisma'
import { getOrCreateConversation } from '@/lib/conversation'
import ChatHeader from '@/components/chat/chat-header'
import { ChatMessage } from '@/components/chat/chat-messasges'
import ChatInput from '@/components/chat/chat-input'
interface MemberPageProps {
  params: Promise<{
    memberId: string;
    serverId: string;
  }>;
}

const MemberPage = async ({params}: MemberPageProps) => {
    const user = await getCurrentUser();
    const { serverId, memberId } = await params;


    if(!user) return redirect("/login");
    const currentMember = await prisma.member.findFirst({
        where: {
            serverId,
            userId: user.id
        },
        include: {
            user: true
        }
   
    })
    if(!currentMember) return redirect("/");


    const conversation  = await getOrCreateConversation(currentMember.id, memberId );


    if(!conversation) return redirect(`/servers/${serverId}`);
   
    const {memberOne, memberTwo} = conversation;


    const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;



  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader  name={otherMember.user.name ?? "Unknown User"} serverId={serverId} type="conversation" />
      <main className="flex-1 overflow-y-auto px-4 py-6">

      <ChatMessage name={otherMember.user.name ?? "Unknown User"} member={otherMember} chatId={conversation.id} type='conversation' apiUrl='/api/direct-messages' paramKey='conversationId' paramValue={conversation.id} socketQuery={{conversationId: conversation.id}} socketUrl='/api/socket/direct-messages' />

      </main>
        <footer className="border-t border-zinc-300 dark:border-zinc-700 px-4 py-3 relative w-full">
      <ChatInput name={otherMember.user.name ?? "Unknown User"} type='conversation' apiUrl='/api/socket/direct-messages' query={{conversationId: conversation.id}} />

      </footer>
    </div>
  )
}


export default MemberPage


