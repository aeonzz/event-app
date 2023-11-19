import prisma from '@/lib/db'
import React, { FC } from 'react'

interface UserDetailsProps {
  params: {
    id: number
  }
}

async function getPost(id: number) {
  const response = await prisma.post.findMany({
    where: {
      authorId: id,
    }
  })

  return response
}

const UserDetails: FC<UserDetailsProps> = async ({ params }) => {

  const userId = +params.id
  const posts = await getPost(userId);

  return (
    <div>
      {posts.map((post) => (
        <h1>{post.title}</h1>
      ))}
    </div>
  )
}

export default UserDetails