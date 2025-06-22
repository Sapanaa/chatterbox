import { Member, Server, User } from "@/app/generated/prisma";
import {Server as NetServer, Socket} from "net"
import { NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {
        user: User;
    })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIoServer;
        };
    };
};