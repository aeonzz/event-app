'use client'
import SignInForm from '@/components/Forms/Signin';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Loading from './loading';

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
        <div className='flex-1 h-screen bg-zinc-800'>
          <h2 className='text-2xl text-start font-bold m-7'>Rendezvy</h2 >
        </div >
        <div className='flex-1 h-screen grid place-items-center border shadow-xl'>
          <SignInForm />
        </div>
      </div >
    </>
  );
};

export default Signin;