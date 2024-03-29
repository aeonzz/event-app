import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from '@/components/Providers/Provider'
import { ThemeProvider } from '@/components/Providers/theme-provider'
import Topbar from '@/components/Navigation/Topbar'
import RightSideBar from '@/components/Navigation/RightSideBar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import QueryProvider from '@/components/Providers/query-provider'
import { EdgeStoreProvider } from '@/lib/edgestore'
import LeftSideBar from '@/components/Navigation/LeftSideBar'
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rendezvy',
  description: 'Events app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights />
        <Provider>
          <EdgeStoreProvider>
            <QueryProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
              >
                {session ? (
                  <>
                    <Topbar />
                    <main className='container h-auto relative flex justify-center px-0'>
                      <LeftSideBar session={session} />

                      {children}
                      <RightSideBar />
                    </main>
                  </>
                ) : (
                  <>
                    {children}
                  </>
                )}

                <Toaster richColors />
              </ThemeProvider>
            </QueryProvider>
          </EdgeStoreProvider>
        </Provider>
      </body>
    </html>
  )
}
