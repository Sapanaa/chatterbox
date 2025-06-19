import { getCurrentUser } from '@/lib/current-user'
import React from 'react'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ChannelType } from '@/app/generated/prisma'
import ServerHeader from './server-header'


interface ServerSidebarProps {
    serverId: string
}
const ServerSidebar =async ({serverId}: ServerSidebarProps) => {
    const user = await getCurrentUser();

    if (!user) {
        return redirect("/login");
    }

    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
     
        members: {
            include: {
                user: true
            },
            orderBy: {
                role: "asc",
            },
        }
           },

    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const voiceChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);


    const members = server?.members.filter((member) => member.userId !== user.id);

    if(!server) {
        return redirect("/");
    }
    
    const role = server.members.find((member) => member.userId === user.id)?.role;

  return (
    <div className='flex flex-col h-full text-primary w-full  dark:bg-[#2B2] bg-[#F2F3F5]'>
        Server Channel
    <ServerHeader server={server} role={role}/>
      
    </div>
  )
}

export default ServerSidebar
