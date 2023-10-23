import { Separator } from "@/components/ui/separator"
import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function getData(): Promise<User[]> {
  const data = await prisma.user.findMany()
  return data
}

export default async function UsersTable() {
  const data = await getData()

  return (
    <>
      <h1 className='text-3xl font-bold'>Users manager</h1>
      <p className='text-sm font-normal'>Effortlessly Organizing and Controlling users</p>
      <DataTable columns={columns} data={data} />
    </>
  )
}
