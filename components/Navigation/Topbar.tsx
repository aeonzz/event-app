import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Toggle from '../ui/theme-toggle';
import UserNav from '@/components/user-nav';
import PostTabs from './PostTabs';
import { MainNav } from '../SupAdmin-components/mainNav';
import Notification from './Notification';


const Topbar = async () => {

  const session = await getServerSession(authOptions);

  return (
    <>
      <div className='py-4 z-10 sticky top-0 w-full dark:bg-background/50 backdrop-blur-sm backdrop-filter'>
        <div className='container flex items-center justify-between px-10'>
          <div className='flex items-center gap-6'>
            <Link
              href='/'
            >
              <h2 className='text-xl text-start font-bold'>Rendezvy</h2>
            </Link>
            {session?.user.role === 'SYSTEMADMIN' && <MainNav />}
          </div>
          {/* <PostTabs /> */}
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <Toggle />
              <Notification />
            </div>
            <UserNav />
            {/* {session?.user ? (
              <UserNav />
            ) : (
              <Link className={buttonVariants()} href='/sign-in'>
                Sign in
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;