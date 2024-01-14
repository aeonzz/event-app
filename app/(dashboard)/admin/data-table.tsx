"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button, buttonVariants } from "@/components/ui/button"
import React, { useState } from "react"
import { DataTablePagination } from "./data-table-pagination"
import { ChevronDown, Plus, UserCog, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import SignUpForm from "@/components/Forms/Signup"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CSVLink } from "react-csv";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [open, setOpen] = useState(false)

  const updateOpenState = (newOpenState: boolean) => {
    setOpen(newOpenState);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    }
  })

  const roleFilter = table.getColumn("role")?.getFilterValue() as string ?? ""
  const departmentFilter = table.getColumn("department")?.getFilterValue() as string ?? ""
  const yearFilter = table.getColumn("yearLevel")?.getFilterValue() as string ?? ""
  const sectionFilter = table.getColumn("section")?.getFilterValue() as string ?? ""

  const handleReset = () => {
    table.getColumn("role")?.setFilterValue("");
    table.getColumn("department")?.setFilterValue("");
    table.getColumn("yearLevel")?.setFilterValue("");
    table.getColumn("section")?.setFilterValue("");
  }

  return (
    <Card className='p-5 mt-5'>
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center space-x-4 w-full'>
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-xs bg-[#161312] text-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#161312] text-xs">
                <UserCog className='h-4 w-4 mr-1' />
                Roles
                {roleFilter === "" ? (
                  null
                ) : (
                  <>
                    <Separator
                      className='ml-2 mr-2'
                      orientation="vertical" />
                    {roleFilter === "" ? (
                      null
                    ) : (
                      <Badge
                        variant="secondary"
                      >
                        {roleFilter}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>User roles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
                onValueChange={(newValue) =>
                  table.getColumn("role")?.setFilterValue(newValue)
                }
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="systemadmin">SystemAdmin</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#161312] text-xs">
                <UserCog className='h-4 w-4 mr-1' />
                Year
                {yearFilter === "" ? (
                  null
                ) : (
                  <>
                    <Separator
                      className='ml-2 mr-2'
                      orientation="vertical" />
                    {yearFilter === "" ? (
                      null
                    ) : (
                      <Badge
                        variant="secondary"
                      >
                        {yearFilter}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Year levels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={(table.getColumn("yearLevel")?.getFilterValue() as string) ?? ""}
                onValueChange={(newValue) =>
                  table.getColumn("yearLevel")?.setFilterValue(newValue)
                }
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1st">1st year</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="2nd">2nd year</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3rd">3rd year</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="4th">4th year</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#161312] text-xs">
                <UserCog className='h-4 w-4 mr-1' />
                Section
                {sectionFilter === "" ? (
                  null
                ) : (
                  <>
                    <Separator
                      className='ml-2 mr-2'
                      orientation="vertical" />
                    {sectionFilter === "" ? (
                      null
                    ) : (
                      <Badge
                        variant="secondary"
                      >
                        {sectionFilter}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sections</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={(table.getColumn("section")?.getFilterValue() as string) ?? ""}
                onValueChange={(newValue) =>
                  table.getColumn("section")?.setFilterValue(newValue)
                }
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="A">A</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="B">B</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="C">C</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="D">D</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#161312] text-xs">
                <UserCog className='h-4 w-4 mr-1' />
                Department
                {departmentFilter === "" ? (
                  null
                ) : (
                  <>
                    <Separator
                      className='ml-2 mr-2'
                      orientation="vertical" />
                    {departmentFilter === "" ? (
                      null
                    ) : (
                      <Badge
                        variant="secondary"
                      >
                        {departmentFilter}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Departments</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={(table.getColumn("department")?.getFilterValue() as string) ?? ""}
                onValueChange={(newValue) =>
                  table.getColumn("department")?.setFilterValue(newValue)
                }
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="BSIT">BSIT</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="BSESM">BSESM</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-[#161312] text-xs">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {roleFilter === "" && departmentFilter === "" && yearFilter === "" && sectionFilter === "" ? (
            null
          ) : (
            <Button
              onClick={() => handleReset()}
              variant="ghost"
              className="flex items-center"
            >
              reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="px-16 h-8 relative">
              <Plus className='w-4 h-4 absolute left-[28%]' />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold" >Add user</DialogTitle>
              <DialogDescription>
                Please provide the following information to add a new user to the system.
              </DialogDescription>
            </DialogHeader>
            <SignUpForm
              open={open}
              updateOpenState={updateOpenState}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </Card>
  )
}
