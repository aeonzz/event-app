import React, { FC, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

interface SupabaseClientProps {
    children: ReactNode
}

const supabase = createClient("https://cmsskornpjjalwhyjtgg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtc3Nrb3JucGpqYWx3aHlqdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2Mjg3NjIsImV4cCI6MjAxMTIwNDc2Mn0.Xi2Yqc9o8CynjLxuKzR8C5VczmHYMLML8AqJ311vzJw")


const Supabase:FC<SupabaseClientProps> = ({ children }) => {
  return <SessionContextProvider supabaseClient={supabase} >{children}</SessionContextProvider>
}

export default Supabase