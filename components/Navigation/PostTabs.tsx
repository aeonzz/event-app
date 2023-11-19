'use client'
import React from 'react'
import {
  CalendarDays,
  Home,
  HomeIcon,
  Megaphone
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';
import { postTabsNav } from '@/constants';
import Image from 'next/image';


const PostTabs = () => {

  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith('/admin') ? (
        null
      ) : (
        <>
          {/* <Tabs defaultValue="home" className="w-fit absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
            <TabsList className='bg-transparent h-16'>
              <Link href='/'>
                <TabsTrigger
                  value="home"
                  className={`${pathname.startsWith('/user') ? 'data-[state=active]:text-muted-foreground' : 'data-[state=active]:text-primary data-[state=active]:border-b-primary '} px-14 py-5  border-b rounded-none hover:border-b-primary data-[state=active]:bg-transparent`}>
                  <CalendarDays />
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
          </Tabs> */}
          <div className='w-fit absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] flex justify-center'>
            <TooltipProvider delayDuration={400}>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href='/'
                    className={`${pathname === '/' ? 'text-primary !border-b-primary' : 'text-muted-foreground hover:border-b-primary'} w-32 py-5 flex justify-center items-center border-b border-b-transparent`}
                  >
                    <Home />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>home</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href='/events'
                    className={`${pathname === '/events' ? 'text-primary !border-b-primary' : 'text-muted-foreground hover:border-b-primary'} w-32 py-5 flex justify-center items-center border-b border-b-transparent`}
                  >
                    <CalendarDays />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>events</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href='/announcements'
                    className={`${pathname === '/announcements' ? 'text-primary !border-b-primary' : 'text-muted-foreground hover:border-b-primary'} w-32 py-5 flex justify-center items-center border-b border-b-transparent`}
                  >
                    <Megaphone />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>announcements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </>
  )
}

export default PostTabs
