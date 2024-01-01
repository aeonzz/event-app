import CreatePost from "@/components/Admin-components/CreatePost";
import PostCard from "@/components/Post-components/PostCard";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db";
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Suspense } from "react";
import HomeLoading from "../components/Loading/PostsLoading";
import FetchDataError from "@/components/FetchDataError";
import NoPostMessage from "@/components/NoPostMessage";
import Posts from "@/components/Post-components/Posts";
import UsersFeed from "@/components/User-Components/UsersFeed";


export default async function Home() {

  const session = await getServerSession(authOptions);
  console.log(session)
  const published = true
  console.log(session)
  return (
    <div className='w-[58%] h-[500px] mt-4 px-10 flex flex-col'>
      {/* {session?.user.role === 'ADMIN' || session?.user.role === 'SYSTEMADMIN' ?
        <CreatePost />
        : null
      } */}
      <UsersFeed />
    </div>
  )
}
