import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod"

const PostSchema = z.object({
  title: z
    .string()
    .optional(),
  content: z
    .string()
    .min(10),
  authorId: z
    .number()
    .min(0),
  category: z
    .string()
    .min(1),
  published: z
    .boolean(),
  anonymous: z
    .boolean(),
  venue: z
    .string()
    .optional(),
  location: z
    .string()
    .optional(),
  date: z
    .string()
    .optional(),
})

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
        date: true,
        author: true,
        images: true,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, title, authorId, category, published, anonymous, venue, location, date } = PostSchema.parse(body);

    const tag = await prisma.tag.findUnique({
      where: {
        name: category,
      },
    });

    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published,
        anonymous: anonymous,
        location: location,
        venue: venue,
        date: date,
        author: {
          connect: {
            id: authorId,
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