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
    authorId: number | undefined | null
    category: string | undefined
    clicks: number | undefined | null
    going: boolean | undefined
}