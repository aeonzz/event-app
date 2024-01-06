export type UpdateUser = {
    username: string    
    isActive: boolean
    imageUrl: string | null | undefined
    status: string | undefined
    bio: string | null
    deleted: boolean | undefined
    email: string
    password: string 
    role: string
    department: string | null
    yearLevel: string | null
    section: string | null
}