'use client'

import SignInForm from '@/components/Forms/Signin';
import LoadingSpinner from '@/components/Loading/Spinner';
import LoginLoading from '@/components/Loading/login-loading';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

const Signin = () => {

  // const { data: session } = useSession();
  // const router = useRouter();

  // React.useEffect(() => {
  //   if (session) {
  //     router.push('/home');
  //   }
  // }, [session, router]);

  // if (status === 'authenticated') {
  //   return <Loading />
  // }
  return (
    <>
      <div className='w-full h-screen flex items-center'>
        <div className='flex-1 h-screen relative'>
          <h2 className='text-2xl text-start font-bold m-7 absolute top-0 left-0'>Rendezvy</h2 >
          <Suspense fallback={
            <div className='h-screen flex justify-center items-center'>
              <Loader2 className='h-10 w-10 animate-spin stroke-1' />
            </div>
          }>
            <Spline scene="https://prod.spline.design/AhPAZeCbZGLq0-lr/scene.splinecode" />
          </Suspense>
        </div >
        <div className='relative w-[40%] h-screen grid place-items-center shadow-xl'>
          <Link
            href='https://www.facebook.com/christian.caneos.9'
            target='_blank'
            className={cn(
              buttonVariants({ variant: "link" }),
              'absolute top-5 right-5 text-xs text-blue-500'
            )}
          >
            Request an account
          </Link>
          <SignInForm />
        </div>
      </div >
    </>
  );
};

export default Signin;