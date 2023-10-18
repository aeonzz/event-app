import Link from 'next/link';
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
import { Button, buttonVariants } from '../ui/button';
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Toggle from '../ui/theme-toggle';
import UserNav from '@/components/user-nav';
<<<<<<< HEAD
import PostTabs from './PostTabs';
import { MainNav } from '../SupAdmin-components/mainNav';
=======
<<<<<<< HEAD
=======
import { Card } from '../ui/card';
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0

const Topbar = async () => {

  const session = await getServerSession(authOptions);

  return (
    <>
<<<<<<< HEAD
      <div className='py-4 z-10 sticky top-0 w-full dark:border-b dark:bg-background bg-card '>
        <div className='container flex items-center justify-between px-14'>
          <div className='flex items-center gap-6'>
=======
<<<<<<< HEAD
      <div className='py-4 z-10 sticky top-0 w-full dark:border-b dark:bg-background bg-card '>
        <div className='container flex items-center justify-between px-14'>
          <Link
            href='/'
          >
            <h2 className='text-xl text-start font-bold'>Rendezvy</h2>
          </Link>
          <div className='flex items-center gap-3'>
            <Toggle />
            <UserNav />
            {/* {session?.user ? (
=======
      {session ? (
        <div className='py-4 z-10 sticky top-0 w-full dark:border-b dark:bg-background bg-card '>
          <div className='container flex items-center justify-between px-14'>
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
            <Link
              href='/'
            >
              <h2 className='text-xl text-start font-bold'>Rendezvy</h2>
            </Link>
<<<<<<< HEAD
            {session?.user.role === 'SUPERADMIN' && <MainNav />}
          </div>
          <PostTabs />
          <div className='flex items-center gap-3'>
            <Toggle />
            <UserNav />
            {/* {session?.user ? (
=======
            <div className='flex items-center gap-3'>
              <Toggle />
              <UserNav />
              {/* {session?.user ? (
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
              <UserNav />
            ) : (
              <Link className={buttonVariants()} href='/sign-in'>
                Sign in
              </Link>
            )} */}
<<<<<<< HEAD
          </div>
        </div>
      </div>
=======
<<<<<<< HEAD
          </div>
        </div>
      </div>
=======
            </div>
          </div>
        </div>
      ) : (
        <>
        </>
      )}
>>>>>>> b4f88f41c1d58da38834d40882751541699758c9
>>>>>>> 213d160d3629129ad79b2e14bd87ad88133619a0
    </>
  );
};

export default Topbar;