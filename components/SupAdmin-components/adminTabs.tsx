import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import OverviewTab from "./overviewTab"
import prisma from "@/lib/db"
import { User } from "@prisma/client"

async function getCount() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      venue: true,
      location: true,
      dateFrom: true,
      accessibility: true,
      dateTo: true,
      timeFrom: true,
      timeTo: true,
      author: true,
      images: true,
      published: true,
      action: true,
      status: true,
      deleted: true,
      anonymous: true,
      Tag: true,
      createdAt: true,
      updatedAt: true,
      clicks: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  return posts
};

async function getUsers(): Promise<User[]> {
  const data = await prisma.user.findMany({
    where: {
      deleted: false
    },
    orderBy: {
      id: 'desc'
    }
  })

  return data
}


export default async function AdminTabs() {

  const posts = await getCount();
  const users = await getUsers();
  const eventPosts = posts.filter(post => post.Tag.name === 'event');
  const eventPostsCompleted = posts.filter(post => post.status === 'completed');
  const announcementPosts = posts.filter(post => post.Tag.name === 'announcement');
  const eventPostCount = eventPosts.length;
  const announcementPostCount = announcementPosts.length;
  const usersCount = users.length
  const completedEvents = eventPostsCompleted.length

  return (
    <Tabs defaultValue="account" className="w-full mt-5">
      <TabsList className="grid w-[250px] grid-cols-2">
        <TabsTrigger value="account">Overview</TabsTrigger>
        <TabsTrigger value="password">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <OverviewTab
          eventCount={eventPostCount}
          announcementCount={announcementPostCount}
          usersCount={usersCount}
          completedEvents={completedEvents}
        />
      </TabsContent>
      <TabsContent value="password">

      </TabsContent>
    </Tabs>
  )
}
