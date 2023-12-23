'use client'

import {
  LogOut,
  User,
  LayoutDashboard,
  ChevronRight,
  Loader,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Logout from './Logout';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import ProfileLoading from './Loading/ProfileLoading';


export default function UserNav() {


  const { data: session, status } = useSession();

  let initialLetter = '';
  if (session && session.user.username) {
    initialLetter = session.user.username.charAt(0).toUpperCase();
  }

  const { username, email, department } = session?.user || {}

  if (status === 'loading') {
    return <ProfileLoading />
  }

  return (
    <div className='flex gap-3 items-center'>
      {/* <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className='py-8 w-fit justify-start gap-3 rounded-xl hover:bg-transparent group'>
              <Avatar className="h-9 w-9 -ml-1">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback>{initialLetter}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start'>
                <h2 className='font-semebold text-lg'>{username}</h2>
                {department === 'one' ? null : <p className='text-xs text-muted-foreground'>{department}</p>}
              </div>
              <ChevronRight className='ml-5 group-hover:ml-6 transition-all' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="start" side='right'>
            <DropdownMenuGroup>
              <Link
                href='/user/profile'
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              {session?.user.role === 'SYSTEMADMIN' ? (
                <>
                  <Link
                    href='/admin'
                  >
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin panel
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    href='/pending-post'
                  >
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Pending
                    </DropdownMenuItem>
                  </Link>
                </>
              ) : (
                <></>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='p-0 text-destructive'>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className='py-8 w-[195px] justify-start gap-3 rounded-xl hover:bg-transparent group'>
            <Avatar className="h-9 w-9 -ml-1">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback>{initialLetter}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <h2 className='font-semebold text-lg'>{username}</h2>
              {department === 'one' ? null : <p className='text-xs text-muted-foreground'>{department}</p>}
            </div>
            <ChevronRight className='group-hover:ml-1 transition-all' />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-[200px] p-1' align='end'>
          <Link
            href='/user/profile'
          >
            <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent/50'>
              <User className="mr-2 h-4 w-4" />
              Profile
            </div>
          </Link>
          {session?.user.role === 'SYSTEMADMIN' ? (
            <>
              <Link
                href='/admin'
              >
                <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent/50'>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin panel
                </div>
              </Link>
              <Link
                href='/pending-post'
              >
                <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent/50'>
                  <Loader className="mr-2 h-4 w-4" />
                  Pending
                </div>
              </Link>
            </>
          ) : (
            <></>
          )}
          <DropdownMenuSeparator />
          <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent/50 text-destructive'>
            <Logout />
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}