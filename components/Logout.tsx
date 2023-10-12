'use client'

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

const Logout = () => {
  return (
    <div onClick={() => signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/`
    })} 
    className='flex items-center w-full px-2 py-1.5'>
      <LogOut className="mr-2 h-4 w-4" />
      sign out
    </div>
  )
}

export default Logout