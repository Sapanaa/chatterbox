'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavigationItemProps {
  id: string;
  imageUrl?: string;
  name: string;
}

const bgColors = [
  'bg-red-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

// Simple hash function to convert string to number
function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/servers/${id}`);
  };

  // Generate stable index based on server id or name
  const colorIndex = useMemo(() => hashStringToNumber(id) % bgColors.length, [id]);
  const bgColorClass = bgColors[colorIndex];

  // Extract initials (first 2 letters)
  const initials = name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <button
      onClick={handleClick}
      className="group relative flex items-center justify-center w-12 h-12 rounded-[24px] overflow-hidden transition-all"
    >
      <Avatar className={`w-12 h-12 ${bgColorClass} text-white`}>
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name} />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback>
        )}
      </Avatar>
      <span className="sr-only">{name}</span>
    </button>
  );
};

export default NavigationItem;
