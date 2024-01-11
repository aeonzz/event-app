import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod"


const FormSchema = z.object({
  comment: z.string().min(2),
  postId: z.number().min(0),
})


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session!.user.id;
    const userIdInt = parseInt(userId, 10);

    const body = await req.json();
    const { comment, postId } = FormSchema.parse(body);

    const result = await prisma.comment.create({
      data: {
        comment: comment,
        postId: postId,
        userId: userIdInt,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'could not create post' }, { status: 500 })
  }
}