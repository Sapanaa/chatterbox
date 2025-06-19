import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/current-user";

// PATCH /api/servers/:serverId/inviteCode
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverId } = params;

    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    if (server.userId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updated = await prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SERVER_INVITE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
