import prisma from '@/lib/db'
import React, { FC } from 'react'

interface UserDetailsProps {
  params: {
    id: number
  }
}

async function getUser(id: number) {
  const response = await prisma.user.findFirst({
    where: {
      id: id,
    }
  })

  return response
}

const UserDetails: FC<UserDetailsProps> = async ({ params }) => {

  const userId = +params.id
  const user = await getUser(userId);

  return (
    <div>
      <h1>{user?.email}</h1>
    </div>
  )
}

export default UserDetails