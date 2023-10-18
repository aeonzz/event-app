import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function getData(): Promise<User[]> {
  const data = await prisma.user.findMany()
  return data
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
