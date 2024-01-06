import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { format } from "date-fns";
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
    .boolean()
    .nullable(),
  anonymous: z
    .boolean(),
  venue: z
    .string()
    .optional(),
  location: z
    .string()
    .optional(),
  dateFrom: z
    .string()
    .optional(),
  dateTo: z
    .string()
    .optional(),
  status: z
    .string(),
  timeFrom: z
    .string(),
  timeTo: z
    .string(),
  accessibility: z
    .string()
})

export async function GET(req: Request) {

  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const userIdInt = parseInt(userId, 10);

  try {
    const posts = await prisma.post.findMany({
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
            userId: userIdInt,
          },
          select: {
            going: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'could not fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, title, authorId, category, published, anonymous, venue, status, location, dateFrom, dateTo, timeFrom, timeTo, accessibility } = PostSchema.parse(body);

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
        status: status,
        anonymous: anonymous,
        accessibility: accessibility,
        location: location,
        venue: venue,
        dateFrom: dateFrom,
        dateTo: dateTo,
        timeFrom: timeFrom,
        timeTo: timeTo,
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