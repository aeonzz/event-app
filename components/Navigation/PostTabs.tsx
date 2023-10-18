'use client'
import React from 'react'
import { CalendarDays, Home, Megaphone } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

const PostTabs = () => {

  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith('/admin') ? (
        null
      ) : (
        <Tabs defaultValue="home" className="w-fit absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
          <TabsList className='bg-transparent h-16'>
            <Link href='/'>
              <TabsTrigger
                value="home"
                className={`${pathname.startsWith('/user') ? 'data-[state=active]:text-muted-foreground' : 'data-[state=active]:text-primary data-[state=active]:border-b-primary '} px-14 py-5  border-b rounded-none hover:border-b-primary data-[state=active]:bg-transparent`}>
                <Home />
              </TabsTrigger>
            </Link>
            <Link href='/events'>
              <TabsTrigger
                value="event"
                className={`${pathname.startsWith('/user') ? 'data-[state=active]:text-muted-foreground' : 'data-[state=active]:text-primary data-[state=active]:border-b-primary '} px-14 py-5  border-b rounded-none hover:border-b-primary data-[state=active]:bg-transparent`}>
                <CalendarDays />
              </TabsTrigger>
            </Link>
            <Link href='/announcements'>
              <TabsTrigger
                value="announcement"
                className={`${pathname.startsWith('/user') ? 'data-[state=active]:text-muted-foreground' : 'data-[state=active]:text-primary data-[state=active]:border-b-primary '} px-14 py-5  border-b rounded-none hover:border-b-primary data-[state=active]:bg-transparent`}>
                <Megaphone />
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      )}
    </>
  )
}

export default PostTabs
