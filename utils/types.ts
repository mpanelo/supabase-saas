import { ParsedUrlQuery } from 'querystring'

export interface HomeProps {
  lessons: Lesson[] | null
}

export interface Lesson {
  id: number
  created_at: string
  title: string
  description: string
}

export interface LessonDetailsProps {
  lesson: Lesson
}

export interface Params extends ParsedUrlQuery {
  id: string
}
