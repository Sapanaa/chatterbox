'use client'
import { Server , Member, User, MemberRole} from '@/app/generated/prisma'
import React from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
interface ServerMemberProps {
    member: Member & {user: User}
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='mr-2 h-4 w-4 text-rose-500' />
}
const ServerMember = ({
    member, 
    server
}: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role]
  return (
    <button className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition", params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700/60")}>
        {icon}
        <p className='font-semibold text-sm text-zinc-900 dark:text-zinc-100'>{member.user.name}</p>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>{member.user.email}</p>

    </button>
  )
}

export default ServerMember
