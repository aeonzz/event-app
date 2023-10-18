import CreatePost from "@/components/Admin-components/CreatePost";
import EventCard from "@/components/Post-components/EventCard";
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"

export default async function Home() {

  const session = await getServerSession(authOptions);

  return (
    <div className='w-[50%] mt-4 px-1 flex flex-col gap-4'>
      {session?.user.role === 'ADMIN' || 'SUPERADMIN ' ?
        <CreatePost />
        : null
      }
      <EventCard />
      <EventCard />
      {/* {session?.user.username}
        <Link href='/admin'>hahahahah</Link>
        <h2>Client session</h2>
        <User />
        <h2>Server session</h2>
        {JSON.stringify(session)} */}
    </div>
  )
}
