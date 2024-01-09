import NotFound from '@/app/not-found';
import FetchDataError from '@/components/FetchDataError';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Posts } from '@/types/posts';
import { format, formatDistanceToNow } from 'date-fns';
import { getServerSession } from 'next-auth';
import React from 'react'
import { startOfDay, endOfDay } from 'date-fns';
import InsightsData from '@/components/Admin-components/insights-data';
import Loadingss from './loading';

interface InsightsProps {
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

async function getInteractions(id: number) {
  const userInteractions = await prisma.userPostInteraction.findMany({
    where: {
      postId: id,
      going: true,
    },
    select: {
      userId: true,
      going: true,
      user: {
        select: {
          id: true,
          email: true,
          imageUrl: true,
          username: true,
          yearLevel: true,
          section: true,
          department: true,
          createdAt: true,
          updateAt: true
        },
      },
    }
  });
  return userInteractions
}


async function getInteractionsForDay(id: number, day: Date) {
  const interactions = await prisma.userPostInteraction.findMany({
    where: {
      postId: id,
      going: true,
      createdAt: {
        gte: startOfDay(day),
        lte: endOfDay(day),
      },
    },
  });
  return interactions;
}


const Insights: React.FC<InsightsProps> = async ({ params }) => {

  const session = await getServerSession(authOptions)

  try {
    const postID = +params.id;
    const post = await getPost(postID);
    const interactions = await getInteractions(postID)

    if (post) {

      const interactionsForDay = await getInteractionsForDay(postID, new Date())
      const totalParticipantsCountForDay = interactionsForDay.length

      if (post.Tag.name === 'announcement') {
        return <NotFound className='w-[79.1%]' />
      }

      return (
        <div className='w-[79.1%] mt-4 min-h-[400px] flex flex-col'>
          <InsightsData 
          interactions={interactions}
          totalParticipantsCountForDay={totalParticipantsCountForDay}
          post={post}
          />
          {/* <Loadingss /> */}
        </div>
      )
    } else {
      return <FetchDataError />;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return <FetchDataError />;
  }
}

export default Insights