'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="group relative flex items-center justify-center w-12 h-12 bg-neutral-700 hover:bg-neutral-600 rounded-[24px] overflow-hidden transition-all"
    >
      {/* <Image
        src={imageUrl || '/placeholder.png'} // fallback if imageUrl is empty
        alt={name}
        fill
        className="object-cover"
      /> */}
      <span className="sr-only">{name}</span>
    </button>
  );
};

export default NavigationItem;
