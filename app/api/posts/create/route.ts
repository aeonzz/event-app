import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod"


const PostSchema = z.object({
  title: z
    .string()
    .min(2),
  post: z
    .string()
    .min(10),
  authorId: z
    .string()
    .min(0),
  category: z
    .string()
    .min(1),
})


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post, title, authorId, category } = PostSchema.parse(body);
    const parsedAuthorId = parseInt(authorId, 10);

    const tag = await prisma.tag.findUnique({
      where: {
        name: category,
      },
    });

    const result = await prisma.post.create({
      data: {
        title: title,
        content: post,
        author: {
          connect: {
            id: parsedAuthorId,
          },
        },
        Tag: {
          connect: {
            tagId: tag?.tagId,
          },
        },
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'could not create post' }, { status: 500 })
  }
}