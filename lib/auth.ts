import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_URL,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/sign-in'
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        
        if (!existingUser) {
          return null;
        }

        if (existingUser.status === "banned") {
          throw new Error("Your account has been banned.");
        }

        const isActive = true;
        
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { isActive: true },
        });

        if (!updatedUser) {
          throw new Error("Failed to update user's isActive status.");
        }
        
        // const passwordMatched = await compare(credentials.password, existingUser.password);

        // if (!passwordMatched) {
        //   return null;
        // }

        if (credentials.password !== existingUser.password) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          createdAt: existingUser.createdAt,
          department: existingUser.department,
          isActive: isActive
        }
      }
    })
    
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          department: user.department,
          isActive: user.isActive
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          role: token.role,
          createdAt: token.createdAt,
          department: token.department,
          isActive: token.isActive
        }
      }
    },
  }
}