export type UpdateUser = {
    username: string    
    isActive: boolean
    imageUrl: string | null
    status: string | undefined
    bio: string | null
    deleted: boolean | undefined
    email: string
    password: string 
    role: string
    department: string | null
}