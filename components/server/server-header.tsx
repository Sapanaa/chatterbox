'use client'
import React from 'react'
import { ServerWithMembersWithProfiles } from '@/types'
import { MemberRole } from '@/app/generated/prisma'
import { DropdownMenu } from '../ui/dropdown-menu'
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut
} from '../ui/dropdown-menu'
import { useModal } from '@/hooks/use-modal-store'


interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles,
    role?: MemberRole
}

const ServerHeader = ({server, role}: ServerHeaderProps) => {
    const {onOpen} = useModal()

    const isAdmin = role === MemberRole.ADMIN   
    const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="flex items-center text-sm font-semibold hover:underline">
            {server.name}
                   
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-semibold">
                    {server.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isModerator && (
                    <DropdownMenuItem onClick={() => onOpen('invite', {server})}>
                        Invite People
                        <DropdownMenuShortcut>⌘+I</DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('editServer', {server})}>
                        Server Settings
                        <DropdownMenuShortcut>⌘+M</DropdownMenuShortcut>
                    </DropdownMenuItem> 
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('members', {server})}>
                        Manage Members
                        <DropdownMenuShortcut>⌘+C</DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem onClick={() => onOpen('createChannel', {server})}>
                        Create Channels
                        <DropdownMenuShortcut>⌘+K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem >
                        Delete Server
                        <DropdownMenuShortcut>⌘+D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('leaveServer', {server})}>
                        Leave Server
                        <DropdownMenuShortcut>⌘+D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

       
      
    </div>
  )
}

export default ServerHeader
