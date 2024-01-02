import prisma from "@/lib/db"
import { hash } from "bcrypt";
import { NextResponse } from "next/server"
import * as z from "zod"

const userSchema = z
  .object({
    username: z.string().min(1, 'username is required').max(100),
    email: z.string().min(1, 'email required').email('invalid email'),
    password: z
      .string()
      .min(1, 'password is required')
      .min(8, 'password must have 8 characters'),
    role: z.string().min(1),
    department: z.string().min(1),
    status: z.string().min(1),
    deleted: z.boolean(),
    bio: z.string().optional().nullable(),
    isActive: z.boolean(),
    imageUrl: z.string(),
  })

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    const userIdInt = parseInt(params.userId, 10);
    const user = await prisma.user.delete({
      where: {
        id: userIdInt
      },
    })

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'could not delete post' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {

    const userIdInt = parseInt(params.userId, 10);
    const body = await req.json()
    const { email, username, password, role, department, status, deleted, bio, isActive, imageUrl } = userSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (username !== undefined) {
      updateData.username = username;
    }
    if (password !== undefined) {
      updateData.password = password;
    }
    if (role !== undefined) {
      updateData.role = role;
    }
    if (department !== undefined) {
      updateData.department = department;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (deleted !== undefined) {
      updateData.deleted = deleted;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdInt },
      data: updateData
    });

    const { password: updatedUserPassword, ...rest } = updatedUser;

    return NextResponse.json({ user: rest, message: "User updated successfully" }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'could not update post' }, { status: 500 })
  }
}



export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const userIdInt = parseInt(params.userId, 10);
    const user = await prisma.user.findFirst({
      where: {
        id: userIdInt
      },
    })

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'fuck' }, { status: 500 })
  }
}