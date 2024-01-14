'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../ui/card';
import {
  CalendarClock,
  CalendarDays,
  User2,
} from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { User } from '@prisma/client';

interface OverviewTabProps {
  eventCount: number
  announcementCount: number
  usersCount: number
  completedEvents: number
}


const OverviewTab: React.FC<OverviewTabProps> = ({ eventCount, announcementCount, usersCount, completedEvents }) => {


  return (
    <>
      <div className='w-full h-auto flex flex-col gap-5'>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <CalendarDays className='text-muted-foreground h-5 w-5' />
            </CardHeader>
            <CardContent>
              <h1 className="text-2xl font-bold">
                {eventCount}
              </h1>
              <p className="text-xs text-muted-foreground">
                {eventCount} posts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Announcements
              </CardTitle>
              <CalendarClock className='text-muted-foreground h-5 w-5' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcementCount}</div>
              <p className="text-xs text-muted-foreground">
                {announcementCount} posts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <User2 className='text-muted-foreground h-5 w-5' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
              <p className="text-xs text-muted-foreground">
                {usersCount} users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Completed Event
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedEvents}</div>
              <p className="text-xs text-muted-foreground">
                {completedEvents} events
              </p>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </>
  )
}
export default OverviewTab;