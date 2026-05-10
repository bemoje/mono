export interface Article {
  type: 'article' | 'card'
  time: string
  category: string
  heading: string
  summary?: string | null
  body: string[]
  url: string
  origin: string
  pathname: string
}
