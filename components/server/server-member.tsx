'use client'

import { Server, Member, User, MemberRole } from '@/app/generated/prisma'
import React from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ServerMemberProps {
  member: Member & { user: User }
  server: Server
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-5 w-5 text-indigo-500 flex-shrink-0" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-5 w-5 text-rose-500 flex-shrink-0" />,
}

const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams()
  const router = useRouter()

  const icon = roleIconMap[member.role]

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col px-3 py-2 rounded-md w-full text-left transition-colors",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        params?.memberId === member.id
          ? "bg-zinc-200 dark:bg-zinc-700"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
          {member.user.name}
        </p>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-[26px] truncate">
        {member.user.email}
      </p>
    </button>
  )
}

export default ServerMember
