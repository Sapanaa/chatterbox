'use client'
import React from 'react'
import ChatWelcome from './chat-welcome'
import useChatQuery from '@/hooks/use-chat-query'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { User ,Member,  Message} from '@/app/generated/prisma'
import { format } from 'date-fns'
import ChatItem from './chat-item'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { useScroll } from '@/hooks/use-scroll'
import { useRef } from 'react'
import { ElementRef } from 'react'
const DATE_FORMAT = "d MMM yyyy, HH:mm"
type MessageWithMemberWithProfile = Message & {
    member: Member & { user: User }
}
interface ChatMessageProps {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, string>
    paramKey: string
    paramValue: string
    type: "channel" | "conversation"

}
export const ChatMessage = (
    {name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey,paramValue, type}: ChatMessageProps
) => {
        const chatRef = useRef<ElementRef<"div">>(null)
        const bottomRef = useRef<ElementRef<"div">>(null)
            const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({queryKey: `chat:${chatId}`, apiUrl, paramKey, paramValue});
    useChatSocket({addKey: `chat:${chatId}:messages`, updateKey: `chat:${chatId}:messages:update`, queryKey: `chat:${chatId}`});
        useScroll({chatRef, bottomRef,loadMore: fetchNextPage, shouldLoadMore: !isFetchingNextPage && !hasNextPage, count: data?.pages?.[0]?.items?.length || 0})
            if (status === "loading") {
                return (
                  <div className="flex flex-col flex-1 justify-center items-center">
                    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
                    <p className="text-xs text-gray-500 mt-2">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      LoadingMessages
                    </p>
                  </div>
                )
            }

                if (status === "error") {
                return (
                  <div className="flex flex-col flex-1 justify-center items-center">
                    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
                    <p className="text-xs text-gray-500 mt-2">
                      <ServerCrash className="mr-2 h-4 w-4 animate-spin" /> 
                      Something went wrong
                    </p>
                  </div>
                )
            }
  return (
    <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
        <div className='flex-1'>
     { !hasNextPage && ( <ChatWelcome type={type} name={name} /> )}
        </div>

        {hasNextPage && (
            <div className='flex justify-center'>
            {isFetchingNextPage ? (    <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />)
            : (<button className='text-zinc-500 hover:text-zinc-600 text-xs my-4 dark:text-zinc-400 dark:hover:text-zinc-300' onClick={() => fetchNextPage()}>  Load Previous Messages</button>)}
            </div>

        )}
        <div className='flex flex-col-reverse mt-auto'>
            {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group.items.map((message: MessageWithMemberWithProfile) => (
                        <ChatItem
                        key={message.id}
                        id={message.id}
                        currentMember={member}
                        member={message.member}
                        content={message.content}
                        fileUrl={message.fileUrl}
                        deleted={message.deleted}
                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                        isUpdated={message.updatedAt !== message.createdAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                        />
                      
                    ))}
                    {i === data.pages.length - 1 && hasNextPage && (
                        <div className='flex justify-center'>
                            {isFetchingNextPage ? (
                                <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
                            ) : (
                                <button onClick={() => fetchNextPage()} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'>
                                    Load Previous Messages
                                </button>
                            )}
                        </div>
                    )}
                </Fragment>
                            )
                        )}
        

        </div>
        <div ref={bottomRef}/>
    </div>
  )
}


