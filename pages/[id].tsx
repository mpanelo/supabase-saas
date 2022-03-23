import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { supabase } from '../utils/supabase'
import { Lesson, LessonDetailsProps, Params } from '../utils/types'

const LessonDetails: NextPage<LessonDetailsProps> = ({ lesson }) => {
  return (
    <div className="mx-auto w-full max-w-3xl py-16 px-8">
      <h1 className="mb-6 text-3xl">{lesson.title}</h1>
      <p>{lesson.description}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const { data: lessons } = await supabase.from<Lesson>('lesson').select('id')
  if (!lessons) {
    throw new Error('No lessons found')
  }

  const paths = lessons.map(({ id }) => {
    return {
      params: {
        id: id.toString(),
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  LessonDetailsProps,
  Params
> = async (context) => {
  const { id } = context.params!
  const { data: lesson } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id)
    .single()

  return {
    props: {
      lesson,
    },
  }
}

export default LessonDetails
