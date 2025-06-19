'use client'
import { ChannelType, MemberRole } from '@/app/generated/prisma'
import React from 'react'
import { ServerWithMembersWithProfiles } from '@/types'
import { Plus } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerSectionProps {
    label: string
    role?: MemberRole
    sectionType: "channels" | "members"
    channelType?: ChannelType
    server?: ServerWithMembersWithProfiles
}
const ServerSection = ({label, role, sectionType, channelType, server}: ServerSectionProps) => {
    const {onOpen} = useModal()
  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs font-semibold uppercase '>
        {label}
      </p>
      {
        role !== MemberRole.GUEST && sectionType === "channels" && (
          <div className='flex items-center gap-x-2'>
            <p className='text-xs font-semibold uppercase '>
              <button onClick={() => onOpen('createChannel', {channelType})}>
                <Plus  className='mr-2 h-4 w-4'/>

              </button>
            </p>
          </div>
        )
      }

      {role === MemberRole.ADMIN && sectionType === "members" && (
        <div className='flex items-center gap-x-2'>
            <p className='text-xs font-semibold uppercase '>
              <button onClick={() => onOpen('members', {server})}>
                <Plus  className='mr-2 h-4 w-4'/>

              </button>
            </p>
          </div>
      )}


    </div>
  )
}

export default ServerSection
