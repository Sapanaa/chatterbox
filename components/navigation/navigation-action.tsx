'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/use-modal-store'

const NavigationAction = () => {
    const { onOpen} = useModal()
  return (
    <div>
      <Button onClick={() => onOpen('createServer')}>Add a server</Button>
    </div>
  )
}

export default NavigationAction
