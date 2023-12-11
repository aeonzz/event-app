import prisma from "@/lib/db"
import { NextResponse } from "next/server"

interface contextProps {
  params: {
    postId: number
  }
}

export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context
    const post = await prisma.post.findFirst({
      where: {
        id: params.postId
      },
      include: {
        Tag: true
      }
    })

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'could not create post' }, { status: 500 })
  }
}