export interface IChoice<T> {
  title: string
  value?: T
  disabled?: boolean
  selected?: boolean
  description?: string
}
