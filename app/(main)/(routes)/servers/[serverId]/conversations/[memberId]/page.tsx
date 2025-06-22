import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/current-user'
import prisma from '@/lib/prisma'
import { getOrCreateConversation } from '@/lib/conversation'
import ChatHeader from '@/components/chat/chat-header'
import { ChatMessage } from '@/components/chat/chat-messasges'
import ChatInput from '@/components/chat/chat-input'
interface MemberPageProps {
    params: {
        memberId: string
        serverId: string
    }
}
const MemberPage = async ({params}: MemberPageProps) => {
    const user = await getCurrentUser();


    if(!user) return redirect("/login");
    const currentMember = await prisma.member.findFirst({
        where: {
            serverId: params.serverId,
            userId: user.id
        },
        include: {
            user: true
        }
   
    })
    if(!currentMember) return redirect("/");


    const conversation  = await getOrCreateConversation(currentMember.id, params.memberId, );


    if(!conversation) return redirect(`/servers/${params.serverId}`);
   
    const {memberOne, memberTwo} = conversation;


    const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;



  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader  name={otherMember.user.name ?? "Unknown User"} serverId={params.serverId} type="conversation" />
      <ChatMessage name={otherMember.user.name ?? "Unknown User"} member={otherMember} chatId={conversation.id} type='conversation' apiUrl='/api/direct-messages' paramKey='conversationId' paramValue={conversation.id} socketQuery={{conversationId: conversation.id}} socketUrl='/api/socket/direct-messages' />
      <ChatInput name={otherMember.user.name ?? "Unknown User"} type='conversation' apiUrl='/api/socket/direct-messages' query={{conversationId: conversation.id}} />
    </div>
  )
}


export default MemberPage


