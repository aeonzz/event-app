export type UpdateUser = {
    id: number | undefined
    username: string    
    isActive: boolean
    status: string | undefined
    bio: string | null
    deleted: boolean | undefined
    email: string
    password: string 
    role: string
    department: string | null
}