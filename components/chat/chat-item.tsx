'use client'

import React, { useEffect, useState } from 'react';
import { Member, User, MemberRole } from '@/app/generated/prisma';
import { Trash, Pencil, X, Check } from 'lucide-react';
import axios from 'axios';
import qs from 'query-string';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter , useParams} from 'next/navigation';

const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { user: User };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
    const params = useParams();
    const router = useRouter();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner;

  const userInitial = member.user.name?.charAt(0).toUpperCase() || '?';

  const onMemberClick = () => {
    if(member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [isDeleted, setIsDeleted] = useState(deleted);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  useEffect(() => {
    form.reset({ content });
    setLocalContent(content);
  }, [content]);

  const handleDelete = async () => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.delete(url);
      setIsDeleted(true);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset({ content: localContent });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      setLocalContent(values.content);
      setIsEditing(false);
    } catch (e) {
      console.error("Edit failed:", e);
    }
  };

  return (
    <div className='relative group flex items-start hover:bg-zinc-100 dark:hover:bg-zinc-800 p-4 transition w-full gap-x-4'>
      {/* User Avatar Circle */}
      <div className='flex-shrink-0' >
        <div className='w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold' onClick={onMemberClick}>
          {userInitial} 
        </div>
      </div>

      {/* Message Content */}
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
        {member.user.name}
          <div className='text-xs text-zinc-500 dark:text-zinc-400'>{timestamp}</div>
        </div>

        <div className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
          {isDeleted ? (
            <i className='text-zinc-400 italic'>This message was deleted.</i>
          ) : isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} className="text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button size="icon" type="submit" variant="ghost" title="Save">
                  <Check className="w-4 h-4 text-green-600" />
                </Button>
                <Button size="icon" type="button" variant="ghost" onClick={handleCancelEdit} title="Cancel">
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </form>
            </Form>
          ) : (
            localContent
          )}
        </div>

        {/* Attachment preview */}
        {fileUrl && !isDeleted && (
          <div className='mt-2'>
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 underline text-sm'
            >
              View Attachment
            </a>
          </div>
        )}

        {/* Edited label */}
        {isUpdated && !isDeleted && !isEditing && (
          <div className='text-[10px] text-zinc-400 mt-0.5'>Edited</div>
        )}
      </div>

      {/* Hover-only Edit/Delete Icons */}
      {(canEdit || canDelete) && !isDeleted && !isEditing && (
        <div className='absolute top-2 right-4 hidden group-hover:flex gap-2'>
          {canEdit && (
            <button
              onClick={handleEditToggle}
              className='text-zinc-500 hover:text-blue-600'
              title='Edit'
            >
              <Pencil className='w-4 h-4' />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className='text-zinc-500 hover:text-red-600'
              title='Delete'
            >
              <Trash className='w-4 h-4' />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
