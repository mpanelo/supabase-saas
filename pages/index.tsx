import { supabase } from '../utils/supabase'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { HomeProps, Lesson } from '../utils/types'
import { ContextProps, useUser } from '../context/user'

const Home: NextPage<HomeProps> = ({ lessons }) => {
  const { user } = useUser() as ContextProps
  console.log({ user })
  return (
    <div className="mx-auto my-16 w-full max-w-3xl px-2">
      {lessons?.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="mb-4 flex h-40 rounded p-8 text-xl shadow">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: lessons } = await supabase.from<Lesson>('lesson').select('*')

  return {
    props: {
      lessons,
    },
  }
}

export default Home
