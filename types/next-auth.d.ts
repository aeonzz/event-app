import NextAuth from "next-auth"

declare module "next-auth" {

  interface User {
    username: string
    email: string
    role: string
    createdAt: Date
    department: string | null
  }

  interface Session {
    user: User & {
      username: string 
      role: string
      createdAt: Date
      department: string
    }
    token: {
      username: string
      role: string
      createdAt: Date
      department: string
    }
  }
}
