import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

interface contextProps {
    params: {
      postId: number
    }
  }

export async function GET(req: Request, context: contextProps) {
    try {
      const { params } = context
      const postId = +params.postId;
  
      const post = await prisma.post.findMany({
        where: {
          authorId: postId
        },
        select: {
          id: true,
          title: true,
          content: true,
          venue: true,
          location: true,
          dateFrom: true,
          accessibility: true,
          dateTo: true,
          timeFrom: true,
          timeTo: true,
          author: true,
          images: true,
          published: true,
          status: true,
          deleted: true,
          anonymous: true,
          Tag: true,
          createdAt: true,
          clicks: true,
          UserPostInteraction: {
            where: {
              userId: postId,
            },
            select: {
              going: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      })
  
      return NextResponse.json(post, { status: 200 });
    } catch (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ message: 'could not get posts' }, { status: 500 })
    }
  }
  