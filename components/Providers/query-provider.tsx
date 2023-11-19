'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { FC, ReactNode } from 'react'

interface QueryProviderProps {
    children: ReactNode
}

const queryClient = new QueryClient()

const QueryProvider:FC<QueryProviderProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient} >{children}</QueryClientProvider>
}

export default QueryProvider