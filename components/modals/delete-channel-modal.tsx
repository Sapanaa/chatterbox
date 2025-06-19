'use client'
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import { useParams } from "next/navigation";


export function DeleteChannelModal() {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();


  const isModalOpen = isOpen && type === "deleteChannel"; // <- use the type here
  const {server, channel} = data ;

  const [isLoading, setIsLoading] = useState(false);

    const deleteChannel = async () => {
      try{
          setIsLoading(true)
          const url = qs.stringifyUrl({
            url: `/api/channels/${channel?.id}`,
            query: {
              serverId: server?.id
            }
          })

          await axios.delete(url);
          onClose();
          router.refresh();
          router.push(`/servers/${server?.id}`);
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
          <DialogTitle>Delete Channel</DialogTitle>
          <DialogDescription> Are you sure you want to delete <span className="font-bold text-indigo-500">#{channel?.name} </span>?</DialogDescription>

        </DialogHeader>
      <div>leave server</div>
      <DialogFooter className="px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <Button
            disabled={isLoading}
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={deleteChannel}
          >
            Confirm
          </Button>
        </div>

      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
