import { getCurrentUser } from '@/lib/current-user'
import React from 'react'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ChannelType, MemberRole } from '@/app/generated/prisma'
import ServerHeader from './server-header'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './server-search'
import { Hash, Mic, ShieldCheckIcon, Video } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import ServerSection from './server-section'
import ServerChannel from './server-channel'
import ServerMember from './server-member'


interface ServerSidebarProps {
    serverId: string
}
const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4 text-zinc-500" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4 text-zinc-500" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4 text-zinc-500" />   ,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheckIcon className='mr-2 h-4 w-4 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldCheckIcon className='mr-2 h-4 w-4 text-rose-500' />
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
    <div className='flex flex-col h-full w-full bg-[#F2F3F5] dark:bg-[#1E1E2F] text-primary dark:text-zinc-300'>
    <ServerHeader server={server} role={role}/>
      <ScrollArea className="flex-1 px-3">
        <div className="px-4 py-3 border-b border-zinc-300 dark:border-zinc-700">
            <ServerSearch data={[
                {
                    label: "Text Channels",
                    type: "channel",
                    data: textChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                    }))
                },
                   {
                    label: "Voice Channels",
                    type: "channel",
                    data: voiceChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                    }))
                },
                   {
                    label: "Text Channels",
                    type: "channel",
                    data: videoChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                    }))
                },
                {
                    label: "Members",
                    type: "member",
                    data: members?.map((member) => ({
                        id: member.id,
                        name: member.user.name || "Unknown",
                        icon: roleIconMap[member.role],
                    }))
                },
                ]} />
        </div>
 <Separator className='bg-zinc-300 dark:bg-zinc-700'/>
            {!!textChannels?.length && (
                <div className='mb-2 min-h-[8rem]'>
                    <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Text Channels"
                    />

                    {textChannels.map((channel) => (
                        <ServerChannel key={channel.id} channel={channel} role={role} server={server}/>
                    ))}

                </div>
            )}
            {!!voiceChannels?.length && (
                <div className='mb-2 min-h-[8rem]'>
                    <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Audio Channels"
                    />

                    {voiceChannels.map((channel) => (
                        <ServerChannel key={channel.id} channel={channel} role={role} server={server}/>
                    ))}

                </div>
            )}
                {!!videoChannels?.length && (
                <div className='mb-2 min-h-[8rem]'>
                    <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Video Channels"
                    />

                    {videoChannels.map((channel) => (
                        <ServerChannel key={channel.id} channel={channel} role={role} server={server}/>
                    ))}

                </div>
            )}
             {!!members?.length && (
                <div className='mb-2 min-h-[8rem]'>
                    <ServerSection
                        sectionType="members"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Members"
                        server={server}
                    />

                    {members.map((member) => (
                        <ServerMember key={member.id} member={member} server={server}/>
                    ))}

                </div>
            )}

        </ScrollArea>
    </div>
  )
}

export default ServerSidebar
