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

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "K" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
    setOpen(false);
    if (type === "member") {
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
      return;
    }
    if (type === "channel") {
      router.push(`/servers/${params?.serverId}/channels/${id}`);
      return;
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors w-full max-w-xs mx-auto"
        aria-label="Open server search"
      >
        <Search className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Search</span>
        <kbd className="ml-auto inline-flex items-center gap-1 rounded border border-zinc-300 bg-zinc-200 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-400 select-none pointer-events-none">
          <span>Ctrl</span>+<span>K</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          className="border-b border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 text-zinc-900 dark:text-zinc-100"
          autoFocus
        />
        <CommandList className="max-h-[400px] overflow-auto">
          <CommandEmpty className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            No results found.
          </CommandEmpty>

          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label} className="text-zinc-600 dark:text-zinc-400 font-semibold px-4 py-2">
                {data.map(({ icon, name, id }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => onClick({ id, type })}
                    className="flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="truncate">{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
