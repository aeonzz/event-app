export type UpdateUser = {
    username: string    
    status: string | undefined
    deleted: boolean | undefined
    email: string
    password: string 
    role: string
    department: string | null
}