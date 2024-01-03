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
  status: z
    .string(),
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
    .nullable().or(z.undefined()),
  deleted: z
    .boolean(),
  clicks: z
    .number(),
  going: z
    .boolean()
    .nullable().or(z.undefined()),
  timeFrom: z
    .string(),
  timeTo: z
    .string()
})

export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context
    const postId = +params.postId;

    const post = await prisma.post.findFirst({
      where: {
        id: postId
      },
    })

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'could not create post' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  try {

    const session = await getServerSession(authOptions);

    const userIdInt = parseInt(session!.user.id, 10);
    const postIdInt = parseInt(params.postId, 10);
    const body = await req.json()
    const { title, content, category, published, status, anonymous, venue, location, dateFrom, dateTo, deleted, clicks, going, timeFrom, timeTo } = PostSchema.parse(body);


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
      updateData.Tag = {
        connect: {
          tagId: tag?.tagId,
        },
      };
    }
    if (published !== undefined) {
      updateData.published = published;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (anonymous !== undefined) {
      updateData.anonymous = anonymous;
    }
    if (venue !== undefined) {
      updateData.venue = venue;
    }
    if (dateFrom !== undefined) {
      updateData.dateFrom = dateFrom;
    }
    if (dateTo !== undefined) {
      updateData.dateTo = dateTo;
    }
    if (timeFrom !== undefined) {
      updateData.timeFrom = timeFrom;
    }
    if (timeTo !== undefined) {
      updateData.timeTo = timeTo;
    }
    if (location !== undefined) {
      updateData.location = location;
    }
    if (deleted !== undefined) {
      updateData.deleted = deleted;
    }
    if (clicks !== undefined) {
      updateData.clicks = clicks;
    }
    if (going !== undefined) {
      updateData.UserPostInteraction = {
        update: {
          data: {
            going: going,
          },
          where: {
            userId_postId: {
              userId: userIdInt,
              postId: postIdInt,
            },
          },
        },
      };
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