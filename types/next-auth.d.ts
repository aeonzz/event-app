import NextAuth from "next-auth"

declare module "next-auth" {

  interface User {
    username: string
    email: string
    role: string
    createdAt: Date
    department: string | null
    isActive: boolean
    imageUrl: string | null
  }

  interface Session {
    user: User & {
      username: string 
      role: string
      createdAt: Date
      department: string
      isActive: boolean
      imageUrl: string | undefined
    }
    token: {
      username: string
      role: string
      createdAt: Date
      department: string
      isActive: boolean
      imageUrl: string | undefined
    }
  }
}
