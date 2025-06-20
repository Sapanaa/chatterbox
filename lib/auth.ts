import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../app/generated/prisma";

 
const prisma = new PrismaClient();
export const auth = betterAuth({
    emailAndPassword: {  
        enabled: true
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    
});