import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/Profile-Nav/SideBarNav'
import { sidebarNavItems } from '@/constants'
import { Card } from '@/components/ui/card'
import Provider from '@/components/Provider'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
      <div className='container min-h-[500px] relative flex justify-between p-5'>
        <div className='sticky top-24 w-72 h-fit'>
          <SidebarNav items={sidebarNavItems} />
        </div>
        <div className="w-[73%] mt-8 mb-5 h-auto">
          {children}
        </div>
      </div>
    </Provider>
  )
}
