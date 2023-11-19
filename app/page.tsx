import CreatePost from "@/components/Admin-components/CreatePost";
import PostCard from "@/components/Post-components/PostCard";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db";
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Suspense } from "react";
import HomeLoading from "../components/Loading/HomeLoading";
import FetchDataError from "@/components/FetchDataError";


async function getPost() {
  const response = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: true,
      Tag: true
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  // throw new Error('Simulated error in getPost function');
  return response;

}

export default async function Home() {
  try {

    const posts = await getPost();
    const session = await getServerSession(authOptions);

    return (
      <div className='w-[45%] mt-4 px-1 flex flex-col'>
        {session?.user.role === 'ADMIN' || session?.user.role === 'SUPERADMIN' ?
          <CreatePost />
          : null
        }
        <Suspense fallback={<HomeLoading />}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </Suspense>
        {/* {session?.user.username}
          <Link href='/admin'>hahahahah</Link>
          <h2>Client session</h2>
          <User />
          <h2>Server session</h2>
          {JSON.stringify(session)} */}
      </div>
    )
  } catch (error) {
    return <FetchDataError />
  }
}
