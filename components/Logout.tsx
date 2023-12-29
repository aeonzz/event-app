'use client'

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

const Logout = () => {
  return (
    <div
      onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/`
      })}
      className='flex items-center w-full text-red-600'
    >
      <LogOut className="mr-2 h-4 w-4 stroke-red-600" />
      Sign out
    </div>
  )
}

export default Logout