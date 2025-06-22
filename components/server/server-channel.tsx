'use client'

import { Channel, MemberRole, Server } from '@/app/generated/prisma'
import React from 'react'
import { Edit, Hash, Mic, Trash, Video, Lock } from 'lucide-react'
import { ChannelType } from '@/app/generated/prisma'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModalType, useModal } from '@/hooks/use-modal-store'

interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-5 w-5 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-5 w-5 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-5 w-5 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />,
}

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  const Icon = iconMap[channel.type]

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { channel, server })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center px-3 py-2 rounded-md w-full text-left transition-colors",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        params?.channelId === channel.id
          ? "bg-zinc-200 dark:bg-zinc-700"
          : "bg-transparent"
      )}
      aria-label={`Open channel ${channel.name}`}
    >
      {Icon}
      <span className="truncate flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {channel.name}
      </span>

      {channel.name !== "general" && role !== MemberRole.GUEST ? (
        <div className="ml-auto flex items-center space-x-3 text-zinc-500 dark:text-zinc-400">
          <Edit
            onClick={(e) => onAction(e, "editChannel")}
            className="h-5 w-5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
            aria-label="Edit channel"
            tabIndex={-1}
          />
          <Trash
            onClick={(e) => onAction(e, "deleteChannel")}
            className="h-5 w-5 cursor-pointer hover:text-rose-600 dark:hover:text-rose-400"
            aria-label="Delete channel"
            tabIndex={-1}
          />
        </div>
      ) : (
        channel.name === "general" && (
          <Lock className="ml-auto h-5 w-5 text-zinc-400 dark:text-zinc-600 flex-shrink-0" aria-label="Locked channel" />
        )
      )}
    </button>
  )
}

export default ServerChannel
