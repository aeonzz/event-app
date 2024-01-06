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
import { useRouter } from 'next/navigation';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../Loading/Spinner';
import { User } from '@prisma/client';
import { departments } from '@/constants';
import { UpdateUser } from '@/types/update-user';
import { toast } from 'sonner';

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

function SignUpForm(props: { open: boolean; updateOpenState: (newOpenState: boolean) => void, userData?: User }) {

  const data = props.userData
  const roles = props.userData?.role
  const status = props.userData?.status
  const deleted = props.userData?.deleted
  const dep = props.userData?.department
  const year = props.userData?.yearLevel
  const sec = props.userData?.section
  const id = props.userData?.id
  const imageUrl = props.userData?.imageUrl
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(roles || "USER")
  const [department, setDepartment] = useState(dep || "None")
  const [yearLevel, setYearLevel] = useState(year || "None")
  const [section, setSection] = useState(sec || "None")
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: data?.username || '',
      email: data?.email || '',
      password: data?.password || '',
      confirmPassword: data?.password || '',
    },
  });

  const { mutate: updateUser, data: userData } = useMutation({
    mutationFn: (updateUser: UpdateUser) => {
      return axios.patch(`/api/users/${id}`, updateUser)
    },
    onError: (error) => {
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not update user, Try again later.",
      })
    },
    onSuccess: () => {
      props.updateOpenState(false);
      toast.success("Update Successful", {
        description: "User successfully updated.",
      })
      router.refresh()
    }
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {

      setIsLoading(true);

      if (data) {
        const userData: UpdateUser = { ...values, role, department, status, deleted, bio: props.userData?.bio || null, isActive: false, imageUrl, yearLevel, section };
        if (userData) {
          updateUser(userData);
        }
      } else {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
            role: role,
            department: department,
            yearLevel: yearLevel,
            section: section,
            isActive: false
          })
        })

        if (response.ok) {
          const data = await response.json();

          props.updateOpenState(false);
          router.refresh()
          toast.success("Registration Successful", {
            description: data.message,
          })

        } else if (response.status === 409) {
          const data = await response.json();

          setIsLoading(false);

          toast.error("Uh oh! Something went wrong.", {
            description: data.message,
          })

        } else {
          setIsLoading(false);
          toast.error("Uh oh! Something went wrong.", {
            description: "There was a problem with your request.",
          })
        }
      }


    } catch (error) {
      setIsLoading(false);

      console.error("An error occurred while making the request:", error);

      toast.error("Uh oh! Something went wrong.", {
        description: "An error occurred while making the request.",
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='christian gwapo'
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
          <div className='flex flex-col gap-3'>
            <FormLabel>Department <span className='text-muted-foreground text-xs'>(Optional)</span></FormLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className='h-8 px-3 w-full rounded-sm text-sm text-muted-foreground flex justify-between'
                >
                  {department}
                  <ChevronDown className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[220px]'>
                <DropdownMenuLabel>Departments</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={department} onValueChange={setDepartment}>
                  {departments.map((department) => (
                    <DropdownMenuRadioItem key={department.title} value={department.value}>{department.title}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='flex flex-col gap-3'>
            <FormLabel>User role</FormLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className='h-8 px-3 max-w-[150px] rounded-sm text-sm text-muted-foreground flex justify-between'
                >
                  {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                  <ChevronDown className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-36 max-w-sm'>
                <DropdownMenuLabel>Roles</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                  <DropdownMenuRadioItem value="USER">User</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ADMIN">Admin</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SYSTEMADMIN">Systemadmin</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='flex gap-3'>
            <div className='flex-1 flex flex-col gap-3'>
              <FormLabel>Year level</FormLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className='h-8 px-3 w-full rounded-sm text-sm text-muted-foreground flex justify-between'
                  >
                    {yearLevel}
                    <ChevronDown className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Year levels</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={yearLevel} onValueChange={setYearLevel}>
                    <DropdownMenuRadioItem value="None">None</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1st">1st year</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2nd">2nd year</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="3rd">3rd year</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="4th">4th year</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='flex-1 flex flex-col gap-3'>
              <FormLabel>Section</FormLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className='h-8 px-3 w-full rounded-sm text-sm text-muted-foreground flex justify-between'
                  >
                    {section}
                    <ChevronDown className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sections</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={section} onValueChange={setSection}>
                    <DropdownMenuRadioItem value="None">None</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="A">A</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="B">B</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="C">C</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="D">D</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Button
          className='w-full mt-6'
          type='submit'
          disabled={isLoading}
        >
          {isLoading && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          {data ? <p>Update</p> : <p>Sign up</p>}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;