import type { Metadata } from 'next'
import Provider from '@/components/Providers/Provider'
import Topbar from '@/components/Navigation/Topbar'
import LeftSideBar from '@/components/Navigation/LeftSideBar'
import RightSideBar from '@/components/Navigation/RightSideBar'



export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <Provider>
    <main className='container h-auto relative flex justify-center gap-3'>
      <LeftSideBar />

      <section className='w-[50%] mt-4 px-1 flex flex-col gap-4'>

        {children}

      </section>

      <RightSideBar />
    </main>
    // </Provider>
  )
}
