import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const session = await getServerSession(authOptions);
    const userId = session!.user.id;
    const userIdInt = parseInt(userId, 10);
  
    try {
      const url = new URL(req.url);
      const cursorParam = url.searchParams.get("cursor");
      const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;
  
      const posts = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          venue: true,
          location: true,
          dateFrom: true,
          dateTo: true,
          author: true,
          images: true,
          accessibility: true,
          published: true,
          deleted: true,
          anonymous: true,
          Tag: true,
          createdAt: true,
          clicks: true,
          UserPostInteraction: {
            where: {
              userId: userIdInt,
            },
            select: {
              going: true,
            },
          },
        },
        where: {
          id: cursor ? { lt: cursor } : undefined,
        },
        orderBy: {
          id: 'desc',
        },
        take: 15,
      });
      const lastPost = posts[posts.length - 1];
      const nextCursor = lastPost?.id || undefined;
  
      return NextResponse.json({
        data: posts,
        nextCursor,
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'could not fetch posts' }, { status: 500 });
    }
  }