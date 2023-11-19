import { Separator } from "@/components/ui/separator"
import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { PrismaClient } from '@prisma/client'
import { Suspense } from "react"
import FetchDataError from "@/components/FetchDataError"


const prisma = new PrismaClient()

async function getData(): Promise<User[]> {
  const data = await prisma.user.findMany()

  return data
  // throw new Error('Simulated error in getPost function');
}

export default async function UsersTable() {
  try {
    const data = await getData()

    return (
      <>
        <h1 className='text-3xl font-bold'>Users manager</h1>
        <p className='text-sm font-normal'>Effortlessly Organizing and Controlling users</p>
        <DataTable
          columns={columns}
          data={data}
        />
      </>
    )
  } catch (error) {
    return (
      <div className='w-full h-[90%] flex justify-center items-center'>
        <FetchDataError />
      </div>
    )
  }

}
