export interface Article {
  type: 'article' | 'card'
  time: string
  category: string
  heading: string
  summary: string
  body: string[]
  url: string
}
