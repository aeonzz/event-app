import prisma from "@/lib/db";
import { NextResponse } from "next/server";
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
    isActive: z.boolean()
  })

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, role, department, isActive } = userSchema.parse(body);

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email }
    });
    if (existingUserByEmail) {
      return NextResponse.json({ user: null, message: "Email already exists" }, { status: 409 })
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username }
    });

    if (existingUserByUsername) {
      return NextResponse.json({ user: null, message: "Username already exists" }, { status: 409 })
    }

    // const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        role,
        department,
        isActive
      }
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({message: 'could not fetch users'}, { status: 500 })
  }
}