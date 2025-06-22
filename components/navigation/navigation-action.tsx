'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/use-modal-store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

const NavigationAction = () => {
  const { onOpen } = useModal()

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => onOpen('createServer')}
            size="icon"
            className=" rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all items-center justify-center"
          >
            <Plus className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-sm">
          Add a Server
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NavigationAction
