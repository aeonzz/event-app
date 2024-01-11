'use client'

import { Card, CardContent } from "../ui/card";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CalendarOfEvents from "../User-Components/calendar-of-events";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useQuery } from "@tanstack/react-query";
import { Posts } from "@/types/posts";
import axios from "axios";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { useMutationSuccess } from "../Context/mutateContext";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

const RightSideBar = () => {

  const pathname = usePathname();
  const session = useSession()
  const { isMutate, setIsMutate } = useMutationSuccess()

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  const { data: dataPosts, status, refetch } = useQuery<Posts[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get('/api/posts');
      return response.data
    },
  });

  const latestAnnouncement = dataPosts
    ?.filter((post) => post.published === true && post.deleted === false && post.Tag.name === 'announcement')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .find((post) => !(post.accessibility === 'department' && session.data?.user.department !== post.author.department));

  const handleRefetch = () => {
    refetch();
    setIsMutate(false);
  };

  React.useEffect(() => {
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate]);


  return (
    <>
      {pathname === '/' ||
        pathname === '/events' ||
        pathname === '/announcements' ||
        pathname === '/freedom-wall' ||
        pathname === '/notifications' ||
        pathname === '/pending-post' ||
        pathname.startsWith('/post/') ? (
        <div>
          <aside className='sticky top-16 h-fit w-72 flex flex-col pt-7'>
            <div className='min-h-[96px] w-full flex flex-col gap-10'>
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold leading-none tracking-tight">Upcoming events</h2>
                <Link
                  href='/events'
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    'text-xs h-7'
                  )}
                >
                  See more
                </Link>
              </div>
              <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-xs"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {status === 'pending' && (
                    <div className='flex gap-2 w-full h-24'>
                      <Skeleton className='w-24 h-full ml-4 rounded-md' />
                      <div className='flex flex-col gap-2 flex-1'>
                        <Skeleton className='w-[30%] h-3' />
                        <Skeleton className='w-[100%] h-3' />
                        <Skeleton className='w-[50%] h-3' />
                      </div>
                    </div>
                  )}
                  {status === 'error' && (
                    <h2 className='text-sm'>
                      Something went wrong!!
                    </h2>
                  )}
                  {status !== 'pending' && status !== 'error' && (
                    <>
                      {dataPosts?.map((post) => (
                        post.published === true && post.Tag.name === 'event' && post.deleted === false && post.status === 'upcoming' && (
                          <CarouselItem
                            key={post.id}
                            className="h-24 flex items-center gap-2">
                            <Link
                              href={`/post/${post.id}`}
                              className='w-24 h-full flex justify-center items-center relative rounded-md'>
                              {post.images && post.images.length > 0 ? (
                                <Image
                                  src={post.images[0].url}
                                  alt={`${post.Tag.name} image`}
                                  objectFit="cover"
                                  fill
                                  quality={10}
                                  objectPosition='center'
                                  className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out rounded-md'
                                />
                              ) : (
                                <Image
                                  src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/carbon_no-image.png'
                                  alt={`${post.Tag.name} image`}
                                  width={56}
                                  height={56}
                                  objectFit="cover"
                                  objectPosition='center'
                                  className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out rounded-md'
                                />
                              )}
                            </Link>
                            <div className='flex-1 flex flex-col justify-start h-full gap-1'>
                              <div className='flex gap-1 items-center overflow-hidden py-1'>
                                <Avatar className='h-7 w-7 dark:border relative group bg-stone-900 border'>
                                  <Link
                                    href={`/user/${post.author.id}`}
                                    className='relative'
                                  >
                                    <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                                    <AvatarImage
                                      src={post.author.imageUrl ? post.author.imageUrl : undefined}
                                      className='object-cover'
                                    />
                                    <AvatarFallback className='h-9 w-9 pb-1 pr-1'>
                                      {post.author.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Link>
                                </Avatar>
                                <p className='text-xs'>{post.author.username}</p>
                                {post.author.role === 'SYSTEMADMIN' && (
                                  <BadgeCheck className='h-4 w-4 text-red-500' />
                                )}
                                {post.author.role === 'ADMIN' && (
                                  <BadgeCheck className='h-4 w-4 text-primary' />
                                )}
                              </div>
                              <div className='relative overflow-hidden  h-full'>
                                <div className='absolute w-full h-full z-50 bg-gradient-to-t from-background to-transparent' />
                                <p className='whitespace-pre-wrap break-words text-xs font-bold text-muted-foreground'>{post.title}</p>
                                <p className='whitespace-pre-wrap break-words text-xs text-muted-foreground'>{post.content}</p>
                              </div>
                            </div>
                          </CarouselItem>
                        )))}
                    </>
                  )}
                </CarouselContent>
              </Carousel>
            </div>
            {/* <Separator className='my-4' />
            <div className='h-auto w-full flex flex-col gap-5'>
              <h2 className="text-xl font-semibold leading-none tracking-tight">New announcement</h2>
              <div className='h-auto w-full'>
                {status === 'pending' && (
                  <div className='flex gap-2 w-full h-20'>
                    <Skeleton className='h-9 w-9 rounded-full' />
                    <div className='flex flex-col gap-2 flex-1'>
                      <Skeleton className='w-[30%] h-3' />
                      <Skeleton className='w-[100%] h-3' />
                      <Skeleton className='w-[50%] h-3' />
                    </div>
                  </div>
                )}
                {status === 'error' && (
                  <h2 className='text-sm'>
                    Something went wrong!!
                  </h2>
                )}
                {status !== 'pending' && status !== 'error' && (
                  latestAnnouncement?.published === true && latestAnnouncement?.deleted === false && latestAnnouncement?.Tag.name === 'announcement' && (
                    <>
                      {latestAnnouncement?.accessibility === 'department' && session.data?.user.department !== latestAnnouncement?.author.department ? (
                        null
                      ) : (
                        <Link href={`/post/${latestAnnouncement.id}`} className='h-20'>
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-9 w-9 dark:border relative group bg-stone-900 border'>
                              <Link
                                href={`/user/${latestAnnouncement.author.id}`}
                                className='relative'
                              >
                                <div className='h-9 w-9 bg-stone-950 absolute z-10 opacity-0 group-hover:opacity-40 transition'></div>
                                <AvatarImage
                                  src={latestAnnouncement.author.imageUrl ? latestAnnouncement.author.imageUrl : undefined}
                                  className='object-cover'
                                />
                                <AvatarFallback className='h-9 w-9 pb-1 pr-1'>
                                  {latestAnnouncement.author.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Link>
                            </Avatar>
                            <p className='text-sm font-semibold'>{latestAnnouncement.author.username}</p>
                          </div>
                          <div className='relative overflow-hidden h-10'>
                            <div className='absolute w-full h-full z-50 bg-gradient-to-t from-background to-transparent' />
                            <p className='whitespace-pre-wrap break-words text-xs font-bold text-muted-foreground'>{latestAnnouncement.title}</p>
                            <p className='whitespace-pre-wrap break-words text-xs text-muted-foreground'>{latestAnnouncement.content}</p>
                          </div>
                        </Link>
                      )}
                    </>
                  )
                )}
              </div>
            </div> */}
            <Separator className='my-10' />
            <div className='w-full h-fit flex justify-center'>
              <CalendarOfEvents />
            </div>
          </aside >
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default RightSideBar;