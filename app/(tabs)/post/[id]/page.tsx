import prisma from '@/lib/db'
import Link from 'next/link'
import { Posts } from '@/types/posts'
import FetchDataError from '@/components/FetchDataError'
import PostDetailsCard from '@/components/Post-components/post-details-card'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FC } from 'react'

interface PostDetailProps {
  params: {
    id: number
  }
}

async function getPost(id: number): Promise<Posts | null> {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const userIdInt = parseInt(userId, 10);

  const response = await prisma.post.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      location: true,
      venue: true,
      dateFrom: true,
      dateTo: true,
      accessibility: true,
      timeFrom: true,
      timeTo: true,
      status: true,
      deleted: true,
      clicks: true,
      anonymous: true,
      createdAt: true,
      author: true,
      images: true,
      Comment: {
        select: {
          id: true,
          comment: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
              role: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          id: 'desc'
        }
      },
      UserPostInteraction: {
        where: {
          userId: userIdInt,
        },
        select: {
          going: true,
        },
      },
      Tag: true,
    },
  })

  return response as Posts | null;
}


const PostDetails: FC<PostDetailProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);

  try {
    const postID = +params.id;
    const post = await getPost(postID);

    if (post) {
      return (
        <div className='w-[58%] px-10 mt-4 min-h-[400px] flex flex-col'>
          <PostDetailsCard session={session} post={post} />
        </div>
      );
    } else {
      return <FetchDataError />;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return <FetchDataError />;
  }
};

export default PostDetails;