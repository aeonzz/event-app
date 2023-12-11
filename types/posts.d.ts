export type Posts = {
    id: number
    title: string
    content: string | null
    published: boolean
    anonymous: boolean
    author: {
      username: string
      createdAt: Date
    }
    Tag: {
      name: string 
    }
    createdAt: Date
}