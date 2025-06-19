'use client'
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import  { Check, Copy, RefreshCw } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export function InviteModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();





  const isModalOpen = isOpen && type === "invite"; // <- use the type here
  const {server} = data ;
  console.log(server)

  const [copied, setCopied] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  const onNew =async () => {
    try{
        setIsLoading(true)
        const response = await axios.patch(`/api/servers/${server?.id}/inviteCode`);
        onOpen("invite", {server: response.data})
        
    }
    catch(e){
      console.log(e)
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
          
        </DialogHeader>
      <div className="p-6">
         <Label>Server Invite Link here</Label>
        <div className="flex items-center mt-2 ">
      <Input disabled={isLoading} className="h-9" placeholder="Invite Link"  value={inviteUrl} />
      <Button  disabled={isLoading} className="ml-4" onClick={onCopy}>
        {copied ? <Check className="w-4 h-4" /> :<Copy />}
        </Button>
        </div>
        <div className="flex items-center gap-3">
<Button onClick={onNew} disabled={isLoading} className="mt-6 p-3 ">Generate New Link</Button>
        <RefreshCw className="w-5 h-5 ml-2"/>
        </div>
        
      </div>
      </DialogContent>
    </Dialog>
  );
}
