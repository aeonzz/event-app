export type Posts = {
  id: number
  title: string
  content: string | null
  published: boolean
  deleted: boolean
  venue: string | null
  location: string | null
  date: string | null
  clicks: number
  images: {
    id: number
    url: string
    postId: number
  }[] | null;
  anonymous: boolean
  author: {
    id: number
    email: string
    username: string
    createdAt: Date
  }
  Tag: {
    tagId: number
    name: string
  }
  UserPostInteraction: {
    going: boolean;
  }[]
  createdAt: Date
}