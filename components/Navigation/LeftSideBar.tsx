'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sidebarNav } from '@/constants/index';
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import { Bell, Home, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@prisma/client";
import { Separator } from "../ui/separator";
import ProfileHover from "../profileHover";
import { Suspense, useEffect, useState } from "react";
import LoadingSpinner from "../Loading/Spinner";
import AdminsNavLoading from "../Loading/AdminsNavLoading";
import { format } from "date-fns";
import UserNav from "../user-nav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "../ui/scroll-area";
import NotificationCard from "../User-Components/notification-card";
import { Posts } from "@/types/posts";
import PostGridLoading from "../Loading/PostGridLoading";
import { Skeleton } from "../ui/skeleton";
import { Session } from "next-auth";
import UserNotificationCard from "../User-Components/user-notif-card";
import { useMutationSuccess } from "../Context/mutateContext";


const NavMenu = ({ session }: { session: Session }) => {

  const pathname = usePathname();
  const [open, setOpen] = useState(false)
  const { isMutate, setIsMutate } = useMutationSuccess()

  const onChangeOpenState = (newChangeOpenState: boolean) => {
    setOpen(newChangeOpenState)
  }

  const { data: dataUser, isLoading } = useQuery<User[]>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axios.get('/api/users');
      const data = response.data.map((user: User) => ({
        ...user,
        createdAt: new Date(user.createdAt),
      }));
      return data;
    },
  });

  const { data: dataPosts, status, refetch } = useQuery<Posts[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get('/api/posts');
      return response.data
    },
  });

  const handleRefetch = () => {
    refetch();
    setIsMutate(false);
  };

  useEffect(() => {
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate, refetch, setIsMutate]);


  const filteredPosts = dataPosts?.filter(
    post => post.Tag.name !== 'fw' && post.deleted === false
  ) || []

  const sortedFilteredPosts = [...filteredPosts].sort((a, b) => {
    const dateA = a.action ? new Date(a.action) : new Date(0); 
    const dateB = b.action ? new Date(b.action) : new Date(0); 

    return dateB.getTime() - dateA.getTime();
  });
  return (
    <>
      {pathname === '/' ||
        pathname === '/events' ||
        pathname === '/announcements' ||
        pathname === '/freedom-wall' ||
        pathname === '/notifications' ||
        pathname === '/pending-post' ||
        pathname.startsWith('/user') ||
        pathname.startsWith('/post/') ||
        pathname.startsWith('/insights') ? (
        <div>
          <aside className={cn(
            open ? 'opacity-0 -translate-x-[70%]' : 'opacity-100 translate-x-0',
            'sticky top-16 h-fit w-60 flex flex-col gap-4 items-start pt-7 transition-all duration-500'
          )}>
            <div className='w-full h-auto flex flex-col items-start gap-4'>
              <>
                {sidebarNav.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname === item.link
                        ? 'font-semibold text-primary hover:text-primary'
                        : 'font-light',
                      'w-[90%] flex justify-start text-base py-6 group active:text-slate-400'
                    )}
                  >
                    {pathname === item.link ? (
                      <Image
                        src={item.active}
                        width={28}
                        height={28}
                        alt={item.alt}
                        className='mr-4 group-hover:scale-105 transition-all group-active:scale-95'
                      />
                    ) : (
                      <Image
                        src={item.icon}
                        width={28}
                        height={28}
                        alt={item.alt}
                        className='mr-4 group-hover:scale-105 transition-all group-active:scale-95'
                      />
                    )}
                    {item.title}
                  </Link>
                ))}
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant='ghost'
                      className='w-[90%] flex justify-start text-base py-6 group font-light active:text-slate-400 group'
                    >
                      <Bell className='mr-4 w-7 h-7 group-active:scale-95' />
                      Notifications
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='left' className='w-[30%] pt-16'>
                    <SheetHeader className='px-6 pb-3'>
                      <SheetTitle className='text-2xl'>Notifications</SheetTitle>
                      <SheetDescription>
                        Stay updated with personalized notifications.
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className='h-[85%] pl-3'>
                      {filteredPosts?.length === 0 ? (
                        <div className="w-full h-40 flex justify-center items-center">
                          No notifications
                        </div>
                      ) : (
                        <>
                          {status === 'pending' && (
                            <div className='p-3 w-full flex items-center gap-3'>
                              <Skeleton className='w-9 h-9 rounded-full' />
                              <div className='w-[90%]'>
                                <Skeleton className='h-3 w-full mb-1' />
                                <Skeleton className='h-3 w-[50%]' />
                              </div>
                            </div>
                          )}
                          {status === 'error' && (
                            <div className="border w-full h-40 flex justify-center items-center">
                              Error getting notifications
                            </div>
                          )}
                          {status !== 'pending' && status !== 'error' && (
                            <>
                              {session.user.role === 'SYSTEMADMIN' || session.user.role === 'ADMIN' ? (
                                filteredPosts.map((filteredPost) => (
                                  <NotificationCard
                                    key={filteredPost.id}
                                    post={filteredPost}
                                    onChangeOpenState={onChangeOpenState}
                                    open={open}
                                    session={session}
                                  />
                                ))
                              ) : (
                                <div>
                                  {sortedFilteredPosts.map((filteredPost) => (
                                    <UserNotificationCard
                                      key={filteredPost.id}
                                      post={filteredPost}
                                      onChangeOpenState={onChangeOpenState}
                                      open={open}
                                      session={session}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </>
            </div>
            {/* <Separator className='ml-4' /> */}
            {/* <div className='w-full h-auto flex flex-col gap-4'>
            <h3 className='ml-4 text-sm text-muted-foreground'>Pages</h3>
            {isLoading ? <AdminsNavLoading />
              : (
                <>
                  {dataUser?.map((user) => (
                    user.role === 'ADMIN' && (
                      <div key={user.id}>
                        <Link
                          href={`/user/${user.id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost" }), 'w-full flex justify-start text-xs py-6 font-normal hover:transition-colors'
                          )}
                        >
                          <div className='mr-4'>
                            <ProfileHover
                              username={user.username}
                              date={format(user.createdAt, 'PP')}
                            />
                          </div>
                          {user.username}
                        </Link>
                      </div>
                    )
                  ))}
                </>
              )}
          </div> */}
          </aside >
          <UserNav
            className={cn(
              open ? 'opacity-0 -translate-x-[70%]' : 'opacity-100 translate-x-0',
              'transition-all duration-500'
            )}
          />
        </div >
      ) : (
        null
      )}
    </>
  )
}

export default NavMenu