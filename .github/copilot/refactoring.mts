type CategoryNames = string[]
type Description = string
type Categories = Record<CategoryNames[number], Description>

interface Refactoring {
  fileAndLineNum: `${string}:${number}`
  categoryId: keyof Categories
  impact: 'low' | 'medium' | 'high'
  todo: string[]
}

interface RefactoringSuggestion extends Refactoring {
  approvedByUser: boolean
}

export interface Copilot {
  categories: Categories
  problemsFound: Refactoring[]
  suggestions: RefactoringSuggestion[]
}
