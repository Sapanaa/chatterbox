import React from 'react'

interface ChatMessageProps {
    type: "channel" | "conversation"
    name: string
}
const ChatWelcome = ({type, name}: ChatMessageProps) => {
  return (
    <div className='mt-5 text-center text-xl font-bold text-zinc-500'>
        {type === "channel" ? `Welcome to #${name}` : `Welcome to ${name}`}
      <p>
        {type === "channel" ? `This is the start of the #${name} channel.` : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  )
}

export default ChatWelcome
