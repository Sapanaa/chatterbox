'use client'
import { Search } from 'lucide-react';
import React from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  
} from "@/components/ui/command"
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Separator } from '../ui/separator';

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined;
    }[]
}

const ServerSearch = (
    {data}: ServerSearchProps
) => {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const params = useParams(); 

     React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "K" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const onClick = ({id, type}: {id: string, type: "channel" | "member"}) => {
      setOpen(false);
      if(type === "member") {
          return router.push(`/servers/${params?.serverId}/conversations/${id}`);
      }

      if(type === "channel") {
          return router.push(`/servers/${params?.serverId}/channels/${id}`);
      }
  }

  return (
    <div>
      Server Search Component
      <button 
      onClick={() => setOpen(true)}
      className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700'>
        <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400'/>
        <p className='font-semibold text-md text-zinc-500 dark:text-zinc-300'>
            Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground ml-auto'>
            <span>
                CTRL+
            </span>
            K
        </kbd>
        </button>

         <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({label, type, data}) => {
            if (!data?.length) return null;

            return (
                <CommandGroup key={label} heading={label}>
                    {data.map(({icon, name, id}) => {
                        return (
                            <CommandItem key={id} onSelect={() => onClick({id, type})}>
                                {icon}
                                <span>{name}</span>
                            </CommandItem>
                        )
                    })}
                </CommandGroup>
            )
          })}
      </CommandList>
    </CommandDialog>
   
    </div>
  )
}

export default ServerSearch
