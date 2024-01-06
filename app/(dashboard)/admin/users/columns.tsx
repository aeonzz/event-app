"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  User
} from "lucide-react"
import React, { useState } from "react"
import TableActions from "@/components/SupAdmin-components/tableActions"
import { format } from "date-fns"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type User = {
  id: number;
  email: string;
  name: string | null;
  username: string;
  yearLevel: string | null
  section: string | null
  department: string | null;
  bio: string | null
  status: string
  isActive: boolean,
  imageUrl: string | null
  deleted: boolean
  password: string;
  role: string;
  createdAt: Date;
  updateAt: Date;
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
        className='ml-[-15px]'
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {

      const status = row.original.status

      return (
        <div className='flex gap-3 items-cente'>
          <Badge
          variant="outline"
          className={cn(
            status === 'banned' && 'text-red-500',
            'w-16 justify-center text-[10px]'
          )}
          >
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='ml-[-120px]'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="ml-[-40px]">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "updateAt",
    header: "Last update",
    cell: ({ row }) => {

      const newDate = new Date(row.original.updateAt)
      const newUpdate = format(newDate, 'PPpp')

      return (
        <div>{newUpdate}</div>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TableActions row={row.original} />
  },
]
