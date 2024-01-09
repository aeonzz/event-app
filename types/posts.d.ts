export type Posts = {
  id: number
  title: string
  content: string | null
  published: boolean
  accessibility: string
  status: string
  deleted: boolean
  venue: string | null
  location: string | null
  dateFrom: Date 
  action: string | null
  dateTo: Date 
  timeTo: string
  timeFrom: string
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
    imageUrl: string | null
    department: string
    role: string
  }
  Tag: {
    tagId: number
    name: string
  }
  UserPostInteraction: {
    going: boolean;
  }[]
  createdAt: Date
  updatedAt: Date
}