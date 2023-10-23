import CreatePost from "@/components/Admin-components/CreatePost";
import EventCard from "@/components/Post-components/EventCard";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db";
import { getServerSession } from "next-auth"
import Link from "next/link"


async function getPost() {
  const response = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: true
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  return response;
}

export default async function Home() {

  const posts = await getPost();
  const session = await getServerSession(authOptions);

  return (
    <div className='w-[50%] mt-4 px-1 flex flex-col gap-4'>
      {session?.user.role === 'ADMIN' || session?.user.role === 'SUPERADMIN' ?
        <CreatePost />
        : null
      }
      {posts.map((post) => (
        <EventCard
          key={post.id}
          post={post}
        />
      ))}
      {/* {session?.user.username}
        <Link href='/admin'>hahahahah</Link>
        <h2>Client session</h2>
        <User />
        <h2>Server session</h2>
        {JSON.stringify(session)} */}
    </div>
  )
}
