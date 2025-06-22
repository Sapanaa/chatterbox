'use client'

import { ChannelType, MemberRole } from '@/app/generated/prisma'
import React from 'react'
import { ServerWithMembersWithProfiles } from '@/types'
import { Plus } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithProfiles
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
  const { onOpen } = useModal()

  return (
    <div className="flex items-center justify-between py-2 px-3">
      <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400">{label}</p>

      {(role !== MemberRole.GUEST && sectionType === 'channels') && (
        <button
          onClick={() => onOpen('createChannel', { channelType })}
          aria-label="Create new channel"
          className="group flex items-center rounded-md p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          type="button"
        >
          <Plus className="h-4 w-4 text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
        </button>
      )}

      {(role === MemberRole.ADMIN && sectionType === 'members') && (
        <button
          onClick={() => onOpen('members', { server })}
          aria-label="Manage members"
          className="group flex items-center rounded-md p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          type="button"
        >
          <Plus className="h-4 w-4 text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
        </button>
      )}
    </div>
  )
}

export default ServerSection
