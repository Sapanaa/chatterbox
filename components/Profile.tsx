'use client'

import React from "react";
import { useUser } from "@/lib/current-user";

export default function Profile({ servers }: { servers: any[] }) {
  const user = useUser();

  if (!user) return <p>User not logged in or loading...</p>;

  // Filter servers for current user (can also be done on server)
  const userServers = servers.filter(server =>
    server.members.some((m: any) => m.userId === user.id)
  );

  return (
    <div>
      <p>User name: {user.name}</p>
      <p>User email: {user.email}</p>
      <p>ID: {user.id}</p>

      <h2>Your Servers:</h2>
      <ul>
        {userServers.map(server => (
          <li key={server.id}>{server.name}</li>
        ))}
      </ul>
      
    </div>
  );
}
