'use client'

import React, { useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Check, ChevronsUpDown, Dot, Eye, PrinterIcon, UserPlus } from 'lucide-react';
import ParticipantCard from './participant-card';
import Image from 'next/image';
import ProfileHover from '../profileHover';
import PostStatus from '../Post-components/post-status';
import { Posts } from '@/types/posts';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useReactToPrint } from 'react-to-print';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';

interface InsightsDataProps {
  interactions: {
    userId: number;
    going: boolean;
    user: {
      id: number;
      username: string;
      imageUrl: string | null;
      createdAt: Date;
      email: string;
      department: string | null;
      updateAt: Date;
      yearLevel: string | null
      section: string | null
    };
  }[];
  totalParticipantsCountForDay: number
  post: Posts
}

const yearlevel = [
  {
    value: "1st",
    label: "1st-year",
  },
  {
    value: "2nd",
    label: "2nd-year",
  },
  {
    value: "3rd",
    label: "3rd-year",
  },
  {
    value: "4th",
    label: "4th-year",
  },
]

const sections = [
  {
    value: "a",
    label: "A",
  },
  {
    value: "b",
    label: "B",
  },
  {
    value: "c",
    label: "C",
  },
  {
    value: "d",
    label: "D",
  },
]

const InsightsData: React.FC<InsightsDataProps> = ({ interactions, totalParticipantsCountForDay, post }) => {

  const postedAt = new Date(post.createdAt)
  const totalParticipantsCount = interactions.length
  const componentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [openSection, setOpenSection] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [sectionValue, setSectionValue] = React.useState("")
  const marginTop = '1cm';
  const marginRight = '1cm';
  const marginBottom = '1cm';
  const marginLeft = '1cm';
  const printing = isPrinting ? 'border !bg-transparent' : undefined

  const filteredInteractions = interactions.filter(user =>
    (!value || user.user.yearLevel === value) &&
    (!sectionValue || user.user.section?.toLowerCase() === sectionValue)
  );

  const getPageMargins = () => {
    return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold tracking-tight'>Event insights</h1>
        <AlertDialog open={isPrinting} onOpenChange={setIsPrinting}>
          <AlertDialogTrigger >
            <Button
              variant='secondary'
              size='sm'
              className='!h-7 !px-10 text-xs'
            >
              export
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Print data?</AlertDialogTitle>
              <AlertDialogDescription>
                Confirm your decision to print or export data. This action will generate a PDF containing the selected information.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePrint}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div ref={componentRef} className='h-auto mt-4 grid grid-cols-4 grid-rows-[repeat(3,_minmax(0,_150px))] gap-3'>
        <style type="text/css" media="print">
          {`
          @page {
            size: landscape;
          }
        `}
          {getPageMargins()}
        </style>
        <div className='col-span-4 overflow-hidden relative group rounded-md'>
          <div className='overflow-hidden'>
            {post.images && post.images.length > 0 ? (
              <Image
                src={post.images[0].url}
                alt={`${post.Tag.name} image`}
                fill={true}
                objectFit="cover"
                objectPosition='center'
                className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out brightness-50'
              />
            ) : (
              <Image
                src='https://cmsskornpjjalwhyjtgg.supabase.co/storage/v1/object/public/images/carbon_no-image.png'
                alt={`${post.Tag.name} image`}
                width={56}
                height={56}
                objectFit="cover"
                objectPosition='center'
                className='group-hover:scale-[1.03] transition-transform duration-300 ease-in-out'
              />
            )}
          </div>
          <div className='absolute w-full h-full bg-gradient-to-t from-background to-transparent' />
          <div className='flex items-end gap-3 absolute left-2 bottom-2 w-full h-full'>
            <ProfileHover
              username={post.author.username}
              date={format(post.author.createdAt, 'PP')}
              imageUrl={post.author.imageUrl}
              userId={post.author.id}
            />
            <div className='flex flex-col'>
              <Link
                href={`/user/${post.author.id}`}
                className='hover:underline font-semibold'
              >
                {post.author.username}
              </Link>
              <div className='flex items-center'>
                <p className='text-xs font-light text-muted-foreground'>
                  {formatDistanceToNow(postedAt, { addSuffix: true })}
                </p>
                <Dot />
                <Badge className='w-fit' variant='secondary'>{post.Tag.name}</Badge>
                <PostStatus post={post} className="ml-2 !flex-row" />
              </div>
            </div>
          </div>
        </div>
        <Card className={printing}>
          <CardHeader>
            <CardTitle className='text-xl inline-flex justify-between items-center'>
              Total participants
              <UserPlus className='h-5 w-5 text-muted-foreground' />
            </CardTitle>
            <h3 className='font-semibold text-4xl tracking-tight leading-none'>{totalParticipantsCount}</h3>
            <CardDescription className='text-xs'>+{totalParticipantsCountForDay} Today</CardDescription>
          </CardHeader>
        </Card>
        <Card className={cn(
          printing,
          isPrinting ? 'h-fit' : undefined,
          'col-span-3 row-span-2 p-6'
        )}>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='leading-none font-semibold'>Participants</h3>
              <p className='text-muted-foreground text-xs mt-1'>The event have a total of {totalParticipantsCount} participants</p>
            </div>
            <div className='flex items-center gap-2'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      printing,
                      "w-[170px] justify-between text-xs px-3 h-8 bg-[#161312]"
                    )}
                  >
                    {value
                      ? yearlevel.find((year) => year.value === value)?.label
                      : "Filter year level..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[170px] p-0 ">
                  <Command className='bg-[#161312]'>
                    <CommandInput placeholder="Search year level" className='h-9 text-xs' />
                    <CommandEmpty>No level found</CommandEmpty>
                    <CommandGroup>
                      {yearlevel.map((year) => (
                        <CommandItem
                          key={year.value}
                          value={year.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                          className='text-xs'
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === year.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {year.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover open={openSection} onOpenChange={setOpenSection}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      printing,
                      "w-[140px] justify-between text-xs px-3 h-8 bg-[#161312]"
                    )}
                  >
                    {sectionValue
                      ? sections.find((section) => section.value === sectionValue)?.label
                      : "Filter section..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[140px] p-0 ">
                  <Command className='bg-[#161312]'>
                    <CommandInput placeholder="Search section" className='h-9 text-xs' />
                    <CommandEmpty>No section found</CommandEmpty>
                    <CommandGroup>
                      {sections.map((section) => (
                        <CommandItem
                          key={section.value}
                          value={section.value}
                          onSelect={(currentValue) => {
                            setSectionValue(currentValue === sectionValue ? "" : currentValue)
                            setOpenSection(false)
                          }}
                          className='text-xs'
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              sectionValue === section.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {section.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {filteredInteractions.length === 0 ? (
            <div className='h-32 flex justify-center items-center'>No records</div>
          ) : (
            <>
              {isPrinting ? (
                <div className='mt-3'>
                  {filteredInteractions.map((user) => (
                    <ParticipantCard
                      key={user.userId}
                      user={user.user}
                    />
                  ))}
                </div>
              ) : (
                <ScrollArea className='h-[210px] mt-1 space-y-2'>
                  {filteredInteractions.map((user) => (
                    <ParticipantCard
                      key={user.userId}
                      user={user.user}
                    />
                  ))}
                </ScrollArea>
              )}
            </>
          )}
        </Card>
        <Card className={printing}>
          <CardHeader>
            <CardTitle className='text-xl inline-flex justify-between items-center'>
              Total views
              <Eye className='h-5 w-5 text-muted-foreground' />
            </CardTitle>
            <h3 className='font-semibold text-4xl tracking-tight leading-none'>{post.clicks}</h3>
            <CardDescription className='text-xs'>+{post.clicks} Total</CardDescription>
          </CardHeader>
        </Card>
      </div >
    </div >
  )
}

export default InsightsData