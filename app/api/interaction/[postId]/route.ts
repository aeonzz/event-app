import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

    try {
      const postIdInt = parseInt(params.postId, 10);
      const body = await req.json();
      
      const { going } = body;
      const userIdInt = parseInt(userId, 10);
      
      await prisma.userPostInteraction.upsert({
        where: {
          userId_postId: {
            userId: userIdInt,
            postId: postIdInt
          }
        },
        update: {
          going: going
        },
        create: {
          userId: userIdInt,
          postId: postIdInt,
          going: going
        }
      });
  
      return NextResponse.json({ message: 'Going status updated successfully' }, { status: 200 });
  
    } catch (error) {
      console.error('Error updating going status:', error);
      return NextResponse.json({ message: 'Could not update going status' }, { status: 500 });
    }
  }