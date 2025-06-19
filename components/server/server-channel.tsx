'use client'

import { Channel, MemberRole, Server } from '@/app/generated/prisma'
import React from 'react'
import {Edit, Hash, Mic, Trash, Video, Lock} from 'lucide-react'
import { ChannelType } from '@/app/generated/prisma'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useModal } from '@/hooks/use-modal-store'

interface ServerChannelProps {
        channel: Channel
        server: Server
        role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4 " />
}
const ServerChannel = ({channel, server, role}: ServerChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type]

  return (
    <button
    onClick={() => {}}
    className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition", params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700/60")}>

        {Icon}
        <p 
    className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition", params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700/60")}>

            {channel.name}
        </p>

        {channel.name !== "general" && role !== MemberRole.GUEST && (
            <div className='ml-auto text-xs font-semibold flex '>
                <Edit className='mr-2 h-4 w-4' />
                <Trash onClick={() => onOpen('deleteChannel', {channel})} className='mr-2 h-4 w-4' />
            </div>
        )}

        {channel.name === "general" && (
            <Lock className='mr-2 h-4 w-4' />
        )}
        </button>
  )
}

export default ServerChannel
