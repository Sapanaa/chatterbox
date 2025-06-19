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
import axios from "axios";
import { useRouter } from "next/navigation";


export function DeleteServerModal() {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteServer"; // <- use the type here
  const {server} = data ;

  const [isLoading, setIsLoading] = useState(false);

    const deleteServer = async () => {
      try{
          setIsLoading(true)
          await axios.delete(`/api/servers/${server?.id}`);
          onClose();
          router.refresh();
          router.push("/");
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
          <DialogTitle>Delete Server</DialogTitle>
          <DialogDescription> Are you sure you want to delete <span className="font-bold text-indigo-500">{server?.name} </span>?</DialogDescription>

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
            onClick={deleteServer}
          >
            Confirm
          </Button>
        </div>

      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
