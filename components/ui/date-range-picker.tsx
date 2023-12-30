"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Posts } from "@/types/posts"
import LoadingSpinner from "../Loading/Spinner"

interface DatePickerWithRangeProps {
  onDateChange: (newDate: DateRange | undefined) => void;
  className?: React.HTMLAttributes<HTMLDivElement> | undefined
  dataDate?: DateRange | undefined
}

const fetchPosts = async () => {
  const response = await axios.get('/api/posts');
  return response.data as Posts[];
};

export function DatePickerWithRange({
  className, onDateChange, dataDate
}: DatePickerWithRangeProps) {

  const [showDate, setShowDate] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [disabledDays, setDisabledDays] = React.useState<(Date | { from: Date; to: Date })[]>([]);


  const { data: dataPosts, status } = useQuery<Posts[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  React.useEffect(() => {
    if (status === 'success') {
      const upcomingPosts = dataPosts.filter((post) => post.status === 'upcoming' || post.status === 'ongoing')

      const newDisabledDays = upcomingPosts.map((post) => {
        if (post.dateFrom && post.dateTo) {
          return {
            from: new Date(post.dateFrom as Date),
            to: new Date(post.dateTo as Date),
          };
        } else if (post.dateFrom) {
          return new Date(post.dateFrom as Date);
        } else {
          return null;
        }
      });

      setDisabledDays(
        newDisabledDays.filter((day) => day !== null) as (
          | Date
          | { from: Date; to: Date }
        )[]
      );
    }
  }, [status, dataPosts]);
  // const disabledDays = [
  //   new Date(2024, 1, 10),
  //   new Date(2024, 1, 9),
  //   new Date(2024, 1, 20),
  //   {
  //     from: new Date(2023, 11, 10),
  //     to: new Date(2023, 11, 15)
  //   }
  // ];

  const handleDateSelect = (selectedDate: DateRange, e: any) => {
    e.preventDefault()
    setDate(selectedDate);
    setShowDate((prev) => !prev)
    setOpen(false)

    onDateChange(selectedDate);
  };


  return (
    <div className={cn("flex gap-2 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            size='sm'
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left text-xs font-normal",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {showDate ? (
              date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span className="text-muted-foreground">
                  {dataDate && dataDate.from ? (
                    <>
                      {format(dataDate.from, "LLL dd, y")}
                      {dataDate.to && ` - ${format(dataDate.to, "LLL dd, y")}`}
                    </>
                  ) : (
                    <p>Pick a date</p>
                  )}
                </span>
              )
            ) : (
              <span className="text-muted-foreground">
                {dataDate && dataDate.from ? (
                  <>
                    {format(dataDate.from, "LLL dd, y")}
                    {dataDate.to && ` - ${format(dataDate.to, "LLL dd, y")}`}
                  </>
                ) : (
                  <p>Pick a date</p>
                )}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {status === 'pending' ? <LoadingSpinner /> : (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={disabledDays}
            />
          )}
          <div className='w-full p-3 flex justify-between'>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-red-400/50' />
              <p className='text-xs'>Reserved</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='ghost'
                className="text-xs"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              {showDate && (
                date?.from && (
                  <>
                    <Button
                      size='sm'
                      onClick={(e) => handleDateSelect({ from: undefined, to: undefined }, e)}
                      variant={'destructive'}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  </>
                )
              )}
              <Button
                size='sm'
                className="text-xs"
                onClick={(e) => handleDateSelect({ from: date?.from, to: date?.to }, e)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
