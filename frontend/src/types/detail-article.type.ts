export type DetailArticleType = {
  text: string,
  comments: {
    date: string
    dislikesCount: number
    id: string
    likesCount: number
    text: string
    user: {
      id: string,
      name: string
    }
  }[],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string
}
