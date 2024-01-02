import React, { FC, useState } from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
  BarChartHorizontalBig,
  Loader2,
  MoreHorizontal,
  Tags,
  Trash,
  User2
} from 'lucide-react'
import { User } from '@prisma/client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import SignUpForm from '../Forms/Signup'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { ToastAction } from '../ui/toast'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '../ui/command'
import { UpdateUser } from '@/types/update-user'

interface TableActionProps {
  row: {
    id: number;
    email: string;
    name: string | null;
    username: string;
    department: string | null;
    status: string
    bio: string | null
    isActive: boolean
    deleted: boolean
    password: string;
    role: string;
    createdAt: Date;
    updateAt: Date;
  }
}

const roles = [
  "Admin",
  "User",
  "SystemAdmin"
]

const statuses = [
  "active",
  "ban",
]

const TableActions: FC<TableActionProps> = ({ row }) => {

  const userId = row.id
  const router = useRouter()
  const [label, setLabel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)


  const updateOpenState = (newOpenState: boolean) => {
    setOpen(newOpenState)
    setOpenModal(newOpenState)
    setOpenModalDelete(newOpenState)
    setIsLoading(newOpenState)
  };

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (deleteUser: UpdateUser) => {
      return axios.patch(`/api/users/${userId}`, deleteUser);
    },
    onError: (error) => {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not delete user, Try again later.",
        action: <ToastAction altText="Try again" onClick={() => handleDelete()}>Try again</ToastAction>,
      })
    },
    onSuccess: () => {
      updateOpenState(false);
      router.refresh()
      toast({
        variant: "default",
        title: "Delete Successful",
        description: "User successfully deleted.",
      })
    }
  })

  const { mutate: updateUser } = useMutation({
    mutationFn: (updateUser: UpdateUser) => {
      return axios.patch(`/api/users/${userId}`, updateUser)
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not update user, Try again later.",
      })
    },
    onSuccess: () => {
      updateOpenState(false);
      router.refresh()
      toast({
        variant: "default",
        title: "Update Successful",
        description: "User successfully updated.",
      })
    }
  })

  const handleRoleUpdate = (value: string) => {
    setOpen(false)
    const uppercaseValue = value.toUpperCase();
    const { department, username, email, password, status, deleted, id, isActive, bio } = row
    const data: UpdateUser = {
      department: department,
      username: username,
      bio: bio,
      status: status,
      isActive: isActive,
      deleted: deleted,
      email: email,
      password: password,
      role: uppercaseValue
    }
    updateUser(data)
  }

  const handleStatusUpdate = (value: string) => {
    setOpen(false)

    let status = value;

    if (value === 'ban') {
      status += 'ned';
    }
    const { department, username, email, password, deleted, id, isActive, bio, role } = row
    const data: UpdateUser = {
      department: department,
      username: username,
      bio: bio,
      status: status,
      isActive: isActive,
      deleted: deleted,
      email: email,
      password: password,
      role: role
    }
    updateUser(data)
  }

  const handleDelete = () => {
    setOpen(false)
    setIsLoading(true)
    const { department, username, email, status, password, deleted, id, isActive, bio, role } = row
    const data: UpdateUser = {
      department: department,
      username: username,
      bio: bio,
      status: status,
      isActive: isActive,
      deleted: deleted,
      email: email,
      password: password,
      role: role
    }
    deleteUser(data)
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className='h-[450px]'>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold" >Update user</DialogTitle>
                <DialogDescription>
                  Please provide the following information to update the user in the system.
                </DialogDescription>
              </DialogHeader>
              <SignUpForm
                userData={row}
                open={open}
                updateOpenState={updateOpenState}
              />
            </DialogContent>
          </Dialog>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
              Roles
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup>
                    {roles.map((role) => (
                      <CommandItem
                        key={role}
                        onSelect={(value) => handleRoleUpdate(value)}
                      >
                        {role}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <BarChartHorizontalBig className="mr-2 h-4 w-4" />
              Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status}
                        onSelect={(value) => handleStatusUpdate(value)}
                      >
                        {status}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <Dialog open={openModalDelete} onOpenChange={setOpenModalDelete}>
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-1xl font-semibold" >Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete()}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TableActions