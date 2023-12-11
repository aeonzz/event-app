import NextAuth from "next-auth"

declare module "next-auth" {

  interface User {
    username: string
    email: string
    role: string
    createdAt: Date
  }

  interface Session {
    user: User & {
      username: string 
      role: string
      createdAt: Date
    }
    token: {
      username: string
      role: string
      createdAt: Date
    }
  }
}
