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
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      
      setIsLoading(true);

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password
        })
      })

      if (response.ok) {
        const data = await response.json();

        toast({
          variant: "default",
          title: "Registration Successful",
          description: data.message,
        });

        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);

      } else if (response.status === 409) {
        const data = await response.json();

        setIsLoading(false);

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message,
        });

      } else {
        setIsLoading(false);

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    } catch (error) {
      setIsLoading(false);

      console.error("An error occurred while making the request:", error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while making the request.",
      });
    }
  };

  return (
    <div>
      <Link
        href='/sign-in'
      >
        <Button
          variant='outline'
          size='sm'
          className='absolute top-10 right-10'>
          Login
        </Button>
      </Link>
      <h2 className='text-center text-2xl font-semibold mb-7'>Create an account.</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='johndoe'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={isLoading}
                    />
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
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-Enter your password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Re-Enter your password'
                      type='password'
                      {...field}
                      disabled={isLoading}
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
              <Loader2
                className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign up
          </Button>
        </form>
        <p className='text-center text-sm text-gray-600 mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-blue-500 hover:underline' href='/sign-in'>
            Sign in
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;