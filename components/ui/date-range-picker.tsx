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

interface DatePickerWithRangeProps {
  onDateChange: (newDate: string | undefined) => void;
  className?: React.HTMLAttributes<HTMLDivElement> | undefined
}

export function DatePickerWithRange({
  className, onDateChange
}: DatePickerWithRangeProps) {

  const [showDate, setShowDate] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>()
  console.log(showDate)

  const handleDateSelect = (selectedDate: DateRange, e: any) => {
    e.preventDefault()
    setDate(selectedDate);
    setShowDate((prev) => !prev)
    setOpen(false)

    const formattedDate = selectedDate?.from
      ? selectedDate.to
        ? `${format(selectedDate.from, "LLL dd, y")} - ${format(selectedDate.to, "LLL dd, y")}`
        : format(selectedDate.from, "LLL dd, y")
      : undefined;

    onDateChange(formattedDate);
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
                <span className="text-muted-foreground">Pick a date</span>
              )
            ) : (
              <span className="text-muted-foreground">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className='w-full p-3 flex justify-end'>
            <Button
              size='sm'
              className="text-xs"
              onClick={(e) => handleDateSelect({ from: date?.from, to: date?.to }, e)}
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
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
    </div>
  )
}
