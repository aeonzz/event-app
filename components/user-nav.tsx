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
import { cn } from '@/lib/utils';


export default function UserNav({ className }: { className: string }) {

  const { data: session, status } = useSession();
  const { username, email, department, id, imageUrl } = session?.user || {}

  if (status === 'loading') {
    return <ProfileLoading />
  }

  if (!session) {
    return null
  }

  let initialLetter = '';
  if (session && session.user.username) {
    initialLetter = session.user.username.charAt(0).toUpperCase();
  }

  return (
    <div className={cn(
      className,
      'flex gap-3 items-center fixed bottom-[7%]'
    )}>
      <HoverCard openDelay = { 100} closeDelay = { 100} >
        <HoverCardTrigger asChild>
          <Button variant="ghost" className='py-8 w-[195px] justify-start gap-3 rounded-xl hover:bg-transparent group'>
            <Avatar className="h-9 w-9 -ml-1">
              <AvatarImage src={imageUrl} alt={username} className='object-cover' />
              <AvatarFallback>{initialLetter}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <h2 className='font-semebold text-lg'>{username}</h2>
              {department === 'one' ? null : <p className='text-xs text-muted-foreground'>{department}</p>}
            </div>
            <ChevronRight className='group-hover:ml-1 transition-all' />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-[180px] p-1' align='center'>
          <Link
            href={`/user/${id}`}
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
                  Pending posts
                </div>
              </Link>
            </>
          ) : (
            <></>
          )}
          <DropdownMenuSeparator />
          <div className='relative flex cursor-default select-none items-center rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent/50 text-destructive'>
            <Logout />
          </div>
        </HoverCardContent>
      </HoverCard>
    </div >
  )
}