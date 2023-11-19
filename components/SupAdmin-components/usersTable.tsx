'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { Suspense } from "react";
import Loading from "@/app/(dashboard)/admin/loading"

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function UsersTable() {

  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">id</TableHead>
          <TableHead>username</TableHead>
          <TableHead>email</TableHead>
          <TableHead className="text-right">role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense fallback={<Loading />}>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">{user.role}</TableCell>
            </TableRow>
          ))}
        </Suspense>
      </TableBody>
    </Table>
  )
}
