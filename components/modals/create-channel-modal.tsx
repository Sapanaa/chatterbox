'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import axios  from "axios";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChannelType } from "@/app/generated/prisma";
import { useState } from "react";
import qs from "query-string";
import { useParams } from "next/navigation";


const formSchema = z.object({
  name: z.string().min(2).max(50).refine(
    name => name !== "general",
    { message: "Channel name cannot be 'general'" }
  ),

  type: z.nativeEnum(ChannelType),
});

export function CreateChannelModal() {
  const { isOpen, onClose, type } = useModal()
  const params = useParams();

  const isModalOpen = isOpen && type === "createChannel"; // <- use the type here
  const [isloading, setIsLoading] = useState(false);  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId:params?.serverId
        },
      })

      await axios.post(url, values);
      form.reset();
      window.location.reload(); // optional
    } catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Channel</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase">
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter Channel Name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase ">
                    Channel Type
                  </FormLabel>
                  <Select
                    disabled={isloading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-0 w-full bg-zinc-300/50  focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
