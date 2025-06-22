'use client';

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from 'lucide-react';
import qs from "query-string";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
        const url = qs.stringifyUrl({
            url: apiUrl,
            query,
        });
        await axios.post(url, values);
        form.reset();

    }
    catch(e){
        console.log(e);
        
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-white dark:bg-[#313338] border-t border-zinc-200 dark:border-zinc-700 z-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <button
            type="button"
            className="w-10 h-10 bg-zinc-500 dark:bg-zinc-400 dark:hover:bg-zinc-300 hover:bg-zinc-600 rounded-full flex items-center justify-center transition"
          >
            <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
          </button>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    className="bg-zinc-100 dark:bg-zinc-800 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}

                  />
                </FormControl>
              </FormItem>
            )}
          />

        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
