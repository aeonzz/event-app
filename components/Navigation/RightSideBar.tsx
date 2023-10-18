'use client'

import { Card } from "../ui/card";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar";
import { usePathname } from "next/navigation";


const RightSideBar = () => {

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const pathname = usePathname();

  return (
    <>
<<<<<<< HEAD
      {pathname === '/' || pathname === '/events' || pathname === '/announcements' ? (
=======
      {pathname === '/' ? (
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
        <aside className='sticky top-20 h-fit w-72 flex flex-col gap-4 items-start'>
          <Card className='mb-3 py-3 w-full h-fit flex flex-col items-center gap-1'>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
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

export default RightSideBar;