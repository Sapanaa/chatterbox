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

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <div className="border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1E1E2F] px-4 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="
              flex items-center justify-between w-full
              text-lg font-semibold
              text-zinc-900 dark:text-zinc-100
              hover:text-blue-500 dark:hover:text-blue-400
              transition-colors duration-200
              focus:outline-none
            "
            aria-label={`Open menu for ${server.name}`}
          >
            <span className="truncate">{server.name}</span>
            <svg
              className="ml-2 h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 bg-white dark:bg-[#2A2A40] shadow-lg rounded-md p-2">
          <DropdownMenuLabel className="font-semibold text-zinc-700 dark:text-zinc-300 px-2 py-1">
            {server.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 border-zinc-300 dark:border-zinc-700" />

          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen('invite', { server })}
              className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white transition-colors"
            >
              Invite People
              <DropdownMenuShortcut>⌘+I</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen('editServer', { server })}
                className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white transition-colors"
              >
                Server Settings
                <DropdownMenuShortcut>⌘+M</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onOpen('members', { server })}
                className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white transition-colors"
              >
                Manage Members
                <DropdownMenuShortcut>⌘+C</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onOpen('deleteServer', { server })}
                className="hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white transition-colors"
              >
                Delete Server
                <DropdownMenuShortcut>⌘+D</DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}

          {isModerator && !isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('createChannel', { server })}
              className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white transition-colors"
            >
              Create Channels
              <DropdownMenuShortcut>⌘+K</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('leaveServer', { server })}
              className="hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white transition-colors"
            >
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
