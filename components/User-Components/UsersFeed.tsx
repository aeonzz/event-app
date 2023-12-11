import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Image from 'next/image';
import gg from '@/public/peakpx (1).jpg'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Posts } from '@/types/posts';
import prisma from '@/lib/db';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ChevronRightCircle } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';


async function getRecentEventPost() {
  const recentPost = await prisma.post.findFirst({
    where: {
      Tag: {
        name: 'event'
      },
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return recentPost;
}

async function getRecentAnnouncementPost() {
  const recentPost = await prisma.post.findFirst({
    where: {
      Tag: {
        name: 'announcement'
      },
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return recentPost;
}

const UsersFeed = async () => {

  const event = await getRecentEventPost();
  const announcement = await getRecentAnnouncementPost();

  return (
    <>
      <Tabs defaultValue="department" className="w-full h-auto relative">
        <TabsList className='absolute right-0 bg-transparent'>
          <TabsTrigger value="department" className='w-[100px] text-xs data-[state=active]:bg-stone-900'>Feed</TabsTrigger>
          <TabsTrigger value="about" className='w-[100px] text-xs data-[state=active]:bg-stone-900'>About</TabsTrigger>
        </TabsList>
        <TabsContent value="department" className='h-auto mb-3'>
          <h1 className='text-xl font-semibold mb-2'>Your Feed.</h1>
          <div className='mt-5 w-full h-[550px] grid grid-cols-2 grid-rows-2 gap-3'>
            <Link
              className='row-span-2'
              href={`/post/${event?.id}`}>
              <Card className='relative h-full overflow-hidden flex flex-col justify-between group'>
                <Image
                  className='object-cover h-full object-center absolute group-hover:scale-105 transition-transform duration-700 ease-in-out'
                  src={gg}
                  alt='post image'
                />
                <CardHeader className='z-10'>
                  <CardTitle className='text-xl'>Recent Event</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col justify-end bg-gradient-to-t from-black/30 z-10 w-full h-full absolute group-hover:bg-black/50 transition-all duration-700 ease-in-out'>
                  <p className='whitespace-pre-wrap break-words text-sm'>{event?.content?.slice(0, 300)} ...</p>
                </CardContent>
              </Card>
            </Link>
            <Link href={`/post/${announcement?.id}`}>
              <Card className='relative h-full overflow-hidden flex flex-col justify-between group'>
                <Image
                  className='object-cover h-full object-center absolute group-hover:scale-105 transition-transform duration-700 ease-in-out'
                  src={gg}
                  alt='post image'
                />
                <CardHeader className='z-10'>
                  <CardTitle className='text-xl'>Recent Announcement</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col justify-end bg-gradient-to-t from-black/30 z-10 w-full h-full absolute group-hover:bg-black/50 transition-all duration-700 ease-in-out'>
                  <p className='whitespace-pre-wrap break-words text-sm'>{announcement?.content?.slice(0, 300)} ...</p>
                </CardContent>
              </Card>
            </Link>
            <div className='grid grid-cols-2 grid-rows-2 gap-3'>
              <Link href='/events'>
                <Card className="relative h-full flex flex-col p-3 bg-stone-900 group hover:bg-stone-800/80 transition-colors">
                  <p>Discover more events</p>
                  <div className='relative flex-1'>
                    <ChevronRightCircle className='absolute h-7 w-7 stroke-[#d6d4d4] bottom-0 group-hover:translate-x-2 transition-all duration-700 ease-in-out' />
                  </div>
                </Card>
              </Link>
              <Link href='/announcements'>
                <Card className="relative h-full flex flex-col p-3 bg-stone-900 group hover:bg-stone-800/80 transition-colors">
                  <p>View announcements</p>
                  <div className='relative flex-1'>
                    <ChevronRightCircle className='absolute h-7 w-7 stroke-[#d6d4d4] bottom-0 group-hover:translate-x-2 transition-all duration-700 ease-in-out' />
                  </div>
                </Card>
              </Link>
              <Link
                href='/freedom-wall'
                className='col-span-2'
              >
                <Card className="relative h-full flex flex-col p-3 bg-stone-900 group hover:bg-stone-800/80 transition-colors overflow-hidden">
                  <CardTitle className='text-xl'>
                    Freedom Wall
                  </CardTitle>
                  <p className='text-xs'>A space where every word, and thought is a celebration of individual expression and collective freedom</p>
                  <div className='relative flex-1'>
                    <ChevronRightCircle className='absolute h-7 w-7 stroke-[#d6d4d4] bottom-0 group-hover:translate-x-2 transition-all duration-700 ease-in-out' />
                  </div>
                  <svg width="145" height="120" viewBox="0 0 145 120" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute -right-2 -bottom-7'>
                    <path d="M47.3555 98.3876L35.6709 88.2267L47.8005 82.9086L47.3555 98.3876ZM46.0623 95.438L46.3874 85.0942L38.2341 88.6689L46.0623 95.438ZM42.6452 81.9654L41.5217 82.458L37.3027 72.8353C36.9348 71.9946 36.9201 71.1408 37.2586 70.2739C37.5973 69.4061 38.1872 68.7879 39.0282 68.4191L39.6895 68.1292L40.2012 69.2038L39.5387 69.4932C38.9832 69.7367 38.5979 70.1339 38.3829 70.6846C38.1682 71.2345 38.1827 71.7872 38.4262 72.3427L42.6452 81.9654ZM36.718 84.5631L35.5945 85.0557L35.1231 83.9805C34.8392 83.333 34.3669 82.8803 33.7062 82.6224C33.0446 82.3641 32.3901 82.3769 31.7426 82.6608L30.6459 83.1416L30.1546 82.0186L31.25 81.5372C32.2057 81.1182 33.1728 81.0997 34.1515 81.4818C35.1292 81.8635 35.8276 82.5322 36.2466 83.4879L36.718 84.5631ZM39.6819 83.2636L38.5583 83.7562L35.9102 77.7187C35.6666 77.1632 35.2699 76.7781 34.72 76.5634C34.1701 76.3487 33.617 76.363 33.0606 76.6062L30.6057 77.6826L30.1149 76.5583L32.5693 75.4832C33.4322 75.1042 34.2975 75.084 35.1653 75.4228C36.0331 75.7616 36.6563 76.3628 37.035 77.2266L39.6814 83.2649L39.6819 83.2636ZM45.6091 80.6659L44.4856 81.1585L43.8625 79.7375C43.4336 78.7591 43.4141 77.7703 43.8042 76.7711C44.1946 75.7709 44.8795 75.0566 45.8587 74.6279L47.278 74.0057L47.7706 75.1292L46.3501 75.751C45.6799 76.0448 45.2115 76.5333 44.9448 77.2163C44.6781 77.8994 44.6919 78.5756 44.9861 79.2449L45.6091 80.6659Z" fill="#D6D4D4" />
                    <g clip-path="url(#clip0_617_14)">
                      <path d="M48.313 49.3749L54.4025 45.9226L53.9093 45.0526L47.8198 48.5049L48.313 49.3749ZM46.8335 46.7651L56.4026 41.34L55.9094 40.4701L46.3403 45.8952L46.8335 46.7651ZM45.3539 44.1553L54.9231 38.7303L54.4299 37.8603L44.8607 43.2854L45.3539 44.1553ZM48.512 56.8225L40.8863 43.3717C40.6595 42.9716 40.6043 42.5614 40.721 42.1412C40.8367 41.7208 41.0946 41.3972 41.4948 41.1703L54.3436 33.886C54.7437 33.6591 55.1539 33.604 55.574 33.7206C55.9945 33.8363 56.3181 34.0942 56.545 34.4944L61.8566 43.8635C62.0834 44.2636 62.139 44.6739 62.0233 45.0943C61.9067 45.5145 61.6483 45.838 61.2481 46.0649L49.6712 52.6282L48.512 56.8225ZM48.8066 51.9689L60.755 45.195C60.8884 45.1193 60.9794 44.9941 61.0282 44.8193C61.0761 44.6443 61.0623 44.49 60.9867 44.3567L55.675 34.9876C55.5994 34.8542 55.4742 34.7631 55.2994 34.7143C55.1243 34.6664 54.9701 34.6803 54.8367 34.7559L41.988 42.0402C41.8546 42.1158 41.7635 42.2411 41.7147 42.4159C41.6668 42.5909 41.6806 42.7452 41.7563 42.8785L48.1825 54.2137L48.8066 51.9689Z" fill="#D6D4D4" />
                    </g>
                    <g clip-path="url(#clip1_617_14)">
                      <path d="M107.352 38.3981C102.096 40.0166 98.8484 44.7623 100.149 48.9866C100.486 49.9948 101.041 50.9163 101.775 51.6851C102.509 52.4538 103.404 53.051 104.396 53.4338C104.572 54.0073 104.633 55.6313 103.092 58.5438C105.325 57.7413 107.232 56.2227 108.54 54.2506C109.726 54.2305 110.923 54.0398 112.06 53.6897C117.317 52.0712 120.564 47.3255 119.264 43.1012C117.963 38.8769 112.609 36.7796 107.352 38.3981ZM111.472 51.7782C107.248 53.0789 103.035 51.5615 102.061 48.3981C101.086 45.2346 103.716 41.6102 107.941 40.3095C112.165 39.0089 116.378 40.5263 117.352 43.6897C118.326 46.8531 115.696 50.4775 111.472 51.7782Z" fill="#D6D4D4" />
                    </g>
                    <path d="M90.6482 113.166C76.1567 58.6649 68.2277 118.873 46.8535 64.334" stroke="#656565" />
                    <path d="M124.872 97.5C69.3413 76.3812 56.6451 65.258 99.8716 48" stroke="#656565" />
                    <path d="M140 89.5C167.924 63.6958 26.5001 89.5 123 1" stroke="#656565" />
                    <path d="M83.8297 119.5C83.8297 119.5 -19.1703 90.5 12.8297 79.5C44.8297 68.5 -33.1708 50.5 20.3297 32" stroke="#656565" />
                    <defs>
                      <clipPath id="clip0_617_14">
                        <rect width="24" height="24" fill="white" transform="translate(36 40.8369) rotate(-29.5502)" />
                      </clipPath>
                      <clipPath id="clip1_617_14">
                        <rect width="24" height="24" fill="white" transform="translate(95 39.0625) rotate(-17.1139)" />
                      </clipPath>
                    </defs>
                  </svg>
                </Card>
              </Link>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="about" className='h-auto mb-3'>
          <div className='mb-2 flex items-start gap-2'>
            <Image
              src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/324429893_692617042404789_8825582010059206302_n.jpg'
              alt='ustp logo'
              width={40}
              height={40}
            />
            <h1 className='text-md font-semibold'>University of Science and Technology</h1>
          </div>
          <div className='mt-5 w-full h-auto grid grid-cols-1 grid-rows-3 gap-3'>
            <Card className='bg-stone-900 hover:bg-stone-800/80 transition-colors overflow-hidden'>
              <video
                className='w-full h-full'
                autoPlay>
                <source src="https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/banner.mp4?t=2023-12-06T06%3A04%3A05.309Z" type="video/mp4" />
              </video>
            </Card>
            <Card className='row-span-2 bg-stone-900 hover:bg-stone-800/80 transition-colors overflow-hidden'>
              <CardHeader>
                <CardTitle className='text-xl'>
                  About USTP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-xs'>The University of Science and Technology of Southern Philippines (USTP) is a state university established on August 16, 2016, by virtue of Republic Act 10919 through the amalgamation of the Mindanao University of Science and Technology (MUST) in Cagayan de Oro City, Misamis Oriental and the Misamis Oriental State College of Agriculture and Technology (MOSCAT) in Claveria, Misamis Oriental. It is located in Northern Mindanao, the Gateway to Mindanao, which offers a strategic locational advantage for the institution to train and develop students from all the other regions. <br /> <br />Adhering to its general mandate to primarily provide advanced education; higher technological, professional, and advanced instruction; and advanced research and extension work, required for global competitiveness, the University envisions becoming a nationally recognized S&T University providing the vital link between education and the economy. As the university fulfills this mandate, it moves from within its immediate context and toward its larger international environment, as the first and only national university of science and technology in the country. It will operate as such that it will have seamless knowledge and collaboration with its stakeholders in the private and public sectors, the labor market, business, and industry.</p>
              </CardContent>
              <CardFooter className='justify-end'>
                <Link
                  href='https://www.ustp.edu.ph/'
                  target='_blank'
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    'text-slate-200 text-sm'
                  )}
                >
                  Learn more
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

    </>
  )
}

export default UsersFeed