import { Separator } from '@/components/ui/separator'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <div className='relative h-auto w-full py-5 px-9'>
      {children}
    </div>

  )
}
