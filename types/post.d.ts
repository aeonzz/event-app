export type FormInputPost = {
    title?: string | undefined
    published: boolean
    anonymous: boolean
    deleted?: boolean | undefined
    image?: string | undefined
    content?: string | undefined
    venue?: string | undefined
    location?: string | undefined
    date?: string | undefined
    authorId: string | number | undefined
    category: string | number | undefined
}