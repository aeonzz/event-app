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
import { Button } from "../ui/button";
import Image from "next/image";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";


const LeftSideBar = () => {

  const pathname = usePathname();

  return (
    <>
<<<<<<< HEAD
      {pathname === '/' || pathname === '/events' || pathname === '/announcements' ? (
=======
      {pathname === '/' ? (
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
        <aside className='sticky top-20 h-fit w-72 flex flex-col gap-4 items-start'>
          <Card className='py-3 w-full h-auto flex flex-col items-center gap-1'>
            {sidebarNav.map((item, index) => (
              <Link
                key={index}
                href={item.link}
              >
                <Button
                  variant='ghost'
                  className='w-[260px] p-3 rounded-sm justify-start'
                >
                  <Image
                    src={item.icon}
                    width={20}
                    height={20}
                    alt={item.alt}
                    className='mr-3'
                  />
                  <h3 className='text-base font-semibold'>{item.title}</h3>
                </Button>
              </Link>
            ))}
          </Card>
          <Card className='w-full h-[200px] mb-3'>

          </Card>
        </aside>
      ) : (
<<<<<<< HEAD
        null
=======
        <>
        </>
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
      )}
    </>
  )
}

export default LeftSideBar