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
import { Home, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@prisma/client";
import { Separator } from "../ui/separator";
import ProfileHover from "../profileHover";
import { Suspense } from "react";
import LoadingSpinner from "../Loading/Spinner";
import AdminsNavLoading from "../Loading/AdminsNavLoading";
import { format } from "date-fns";
import UserNav from "../user-nav";

const NavMenu = () => {

  const pathname = usePathname();


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

  return (
    <>
      {pathname === '/' ||
        pathname === '/events' ||
        pathname === '/announcements' ||
        pathname === '/freedom-wall' ||
        pathname === '/notifications' || 
        pathname === '/pending-post' ? (
        <aside className='sticky top-20 h-fit w-60 flex flex-col gap-4 items-start'>
          <UserNav />
          <div className='w-full h-auto flex flex-col items-center gap-4'>
            {sidebarNav.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.link
                    ? 'font-semibold text-primary hover:text-primary'
                    : 'font-light',
                  'w-full flex justify-start text-base py-6 group'
                )}
              >
                {pathname === item.link ? (
                  <Image
                    src={item.active}
                    width={28}
                    height={28}
                    alt={item.alt}
                    className='mr-4 group-hover:scale-105 transition-all'
                  />
                ) : (
                  <Image
                    src={item.icon}
                    width={28}
                    height={28}
                    alt={item.alt}
                    className='mr-4 group-hover:scale-105 transition-all'
                  />
                )}
                {item.title}
              </Link>
            ))}
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
        </aside>
      ) : (
        null
      )}
    </>
  )
}

export default NavMenu