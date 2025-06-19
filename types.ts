import { Member, Server, User } from "@/app/generated/prisma";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {
        user: User;
    })[];
};