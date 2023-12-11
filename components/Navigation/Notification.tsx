import React from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

const Notification = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Bell className='h-[1.2rem] w-[1.2rem]' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[300px] h-[calc(100vh-4rem)] mr-10'>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notification