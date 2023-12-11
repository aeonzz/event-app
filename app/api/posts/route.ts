import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod"

const PostSchema = z.object({
  title: z
    .string()
    .min(2)
    .optional(),
  post: z
    .string()
    .min(10),
  authorId: z
    .string()
    .min(0),
  category: z
    .string()
    .min(1),
  published: z
    .boolean(),
  anonymous: z
    .boolean(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cursorParam = url.searchParams.get("cursor");
    const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        published: true,
        anonymous: true,
        Tag: true,
        createdAt: true
      },
      where: {
        id: cursor ? { lt: cursor } : undefined,
      },
      orderBy: {
        id: 'desc',
      },
      take: 10, 
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post, title, authorId, category, published, anonymous } = PostSchema.parse(body);
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
        published: published,
        anonymous: anonymous,
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