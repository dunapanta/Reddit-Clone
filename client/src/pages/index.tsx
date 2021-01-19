import Axios from 'axios'
import Head from 'next/head'
import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from  'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import useSWR from 'swr'
import Image from 'next/image'

import { Post, Sub } from '../types'
import PostCard from '../components/PostCard'
import { useAuthState } from '../context/auth'
/* import { GetServerSideProps } from 'next' */

// para el tiempo en ves de momentjs
dayjs.extend(relativeTime)

export default function Home() {

  /* const [posts, setPosts] = useState<Post[]>([])

  useEffect( () => {
    Axios.get('/posts')
    .then(res => setPosts(res.data))
    .catch(err => console.log(err))
  },[])  */

  const { authenticated } = useAuthState()

  /* Usando SWR */
  const { data: posts } = useSWR('/posts')
  const { data: topSubs } = useSWR('/misc/top-subs')

  return (
    <Fragment>
      <Head>
        <title>Reddit Clone</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-full px-3 md:w-160 md:p-0">
          {posts?.map(post =>(
            <PostCard key={post.identifier} post={post} />
          ))}

        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top 5 Comunidades
              </p>
            </div>
            <div>
              {topSubs?.map((sub: Sub) => (
                <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                  <Link href={`/r/${sub.name}`}> 
                    <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className="rounded-full cursor-pointer"
                        width={6 * 16 / 4}
                        height={6 * 16 / 4}
                      />
                    </a>
                    </Link>
                  <Link href={`/r/${sub.name}`}>
                      <a className="ml-2 font-bold hover:cursor-pointer">
                        /r/{sub.name}
                      </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">Crear Comunidad</a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}


//Function for Server Side Rendering
// esta funcion se ejecuta en el lado del servidor antes que esta pagina se cree y renderice
// permite renderizar la pagina ya con los datos
/* export const getServerSideProps: GetServerSideProps = async (context) => {
  try{
    const res = await Axios.get('/posts')

    return { props: { posts: res.data }}
  }catch(err){
    return { props: { error: "Algo ha salido mal"}}
  }
} */