import { Circle, Hash} from 'lucide-react'
import React from 'react'
import MobileToggle from '../mobile-toggle'
import { SocketIndicator } from '../socket-indicator'

interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conversation",
}
const ChatHeader = ({serverId, name, type }: ChatHeaderProps) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-b-2'>
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
          <Hash className='w-5 h-5 mr-2' />
          
      )}
      {
          type === "conversation" && (
              <Circle className='w-5 h-5 mr-2' />
          )
      }
          <p>{name}</p>

          <div> 
            <SocketIndicator />
          </div>

    </div>
  )
}

export default ChatHeader
