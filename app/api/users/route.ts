import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({message: 'could not fetch users'}, { status: 500 })
  }
}