'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';


const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    setIsLoading(true);

    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 20000)

    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    });

    if (signInData?.error) {
      setIsLoading(false);

      if (signInData.error === "Your account has been banned.") {
        toast.error("Account Banned.", {
          description: "Your account has been banned. Please contact support for assistance.",
        })
      } else {
        toast.error("Unauthorized.", {
          description: "Invalid email or password. Please try again.",
        })
      }
    } else {
      router.refresh();
      router.push('/');
    }
  };

  return (
    <div className='relative w-[270px] mb-10'>
      <div className='mb-7'>
        <h2 className='text-center text-xl font-semibold'>Welcome to Rendezvy</h2>
        <p className='text-muted-foreground text-xs text-center'>Please login your account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='mail@example.com'
                      {...field}
                      disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className='w-full mt-6'
            type='submit'
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {isLoading ? <p>Signing in</p> : <p>Sign in</p>}
          </Button>
        </form>

        {/* <p className='text-center text-sm text-gray-600 mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-blue-500 hover:underline' href='/sign-up'>
            Sign up
          </Link>
        </p> */}
      </Form>
    </div>
  );
};

export default SignInForm;