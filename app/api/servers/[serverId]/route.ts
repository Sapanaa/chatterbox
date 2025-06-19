// app/api/servers/[serverId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/current-user';
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


    const server = await prisma.server.delete({
      where: {
        id: params.serverId,
        userId: user.id
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('PATCH /api/servers/[serverId] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const updatedServer = await prisma.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error('PATCH /api/servers/[serverId] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

