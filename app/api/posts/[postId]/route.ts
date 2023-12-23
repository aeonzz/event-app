import prisma from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"

interface contextProps {
  params: {
    postId: number
  }
}

const PostSchema = z.object({
  title: z
    .string()
    .optional()
    .nullable(),
  content: z
    .string()
    .min(10),
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
  deleted: z
    .boolean(),
  clicks: z
    .number(),
  going: z
  .boolean()
  .nullable().or(z.undefined()),
})

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

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  try {

    const postIdInt = parseInt(params.postId, 10);
    const body = await req.json()
    const { title, content, category, published, anonymous, venue, location, date, deleted, clicks, going} = PostSchema.parse(body);

    const updatedClicks = clicks + 1;

    const tag = await prisma.tag.findUnique({
      where: {
        name: category,
      },
    });

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      updateData.title = title;
    }
    if (content !== undefined) {
      updateData.content = content;
    }
    if (category !== undefined) {
      updateData.tagTagId = tag?.tagId;
    }
    if (published !== undefined) {
      updateData.published = published;
    }
    if (anonymous !== undefined) {
      updateData.anonymous = anonymous;
    }
    if (venue !== undefined) {
      updateData.venue = venue;
    }
    if (date !== undefined) {
      updateData.date = date;
    }
    if (location !== undefined) {
      updateData.location = location;
    }
    if (deleted !== undefined) {
      updateData.deleted = deleted;
    }
    if (clicks !== undefined) {
      updateData.clicks = updatedClicks;
    }
    if (going !== undefined) {
      updateData.going = going;
    }

    const updatePost = await prisma.post.update({
      where: { id: postIdInt },
      data: updateData
    });

    return NextResponse.json({ post: updatePost, message: "Post updated successfully" }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'could not update post' }, { status: 500 })
  }
}