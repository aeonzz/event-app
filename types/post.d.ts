export type FormInputPost = {
    title?: string | undefined
    published: boolean | undefined | null
    anonymous: boolean | undefined
    deleted?: boolean | undefined
    image?: string | undefined
    accessibility: string | undefined
    content?: string | undefined
    venue?: string | undefined
    location?: string | undefined
    status: string
    dateFrom?: number | undefined | Date
    dateTo?: number | undefined | Date
    timeTo: string | undefined
    timeFrom: string | undefined
    authorId: number | undefined | null
    category: string | undefined
    clicks: number | undefined | null
    going: boolean | undefined
}