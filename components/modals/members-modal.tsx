'use client'
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, MoreVertical } from "lucide-react";
import { DropdownMenuSubContent, DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { Loader2 } from "lucide-react";
import { MemberRole } from "@/app/generated/prisma";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";
import { on } from "events";

export function MembersModal() {
  const router = useRouter();
  const { isOpen,onOpen, onClose, type, data } = useModal();

  const [loadingId, setLoadingId] = useState("");





  const isModalOpen = isOpen && type === "members"; // <- use the type here
  const {server} = data as {server: ServerWithMembersWithProfiles};

  const onRoleChange  =async  (memberId: string, role: MemberRole) => {
      try{

        setLoadingId(memberId);
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: server?.id,
            memberId,
          }
        })

        const response = await axios.patch(url, {role});
        router.refresh();
        onOpen("members", {server: response.data})
        

      }
      catch(e){
        console.log(e)
      }
      finally {
        setLoadingId("");
      }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
           <DialogDescription className="text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
         <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2">
              
              <div className="flex flex-col gap-y-1 leading-none">
                <p className="font-semibold">{member.user.name}</p>
                <p className="text-xs text-zinc-500">{member.user.email}</p>
                <p className="text-xs text-zinc-500">{member.role}</p>
              </div>
              {server.userId != member.user.id && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
  <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSub> 
      <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>Guest {member.role === "GUEST" && <Check className="w-4 h-4 ml-2" />}</DropdownMenuItem>

        <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>Moderator {member.role === "MODERATOR" && <Check className="w-4 h-4 ml-2" />}</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />

    <DropdownMenuItem>Kick</DropdownMenuItem>
    
  </DropdownMenuContent>
</DropdownMenu>
                </div>

              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
          </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
