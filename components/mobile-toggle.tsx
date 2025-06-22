import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import NavigationSideBar from './navigation/NavigationSidebar'


import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import ServerSidebar from './server/server-sidebar'
const MobileToggle = ({serverId}: {serverId: string}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='md:hidden'>
        <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div>
        <NavigationSideBar />

        </div>
        <ServerSidebar serverId={serverId}/>
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
