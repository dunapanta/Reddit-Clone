import Axios from 'axios'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from  'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import useSWR from 'swr'

import { Post } from '../types'
import PostCard from '../components/PostCard'
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

  /* Usando SWR */
  const { data: posts } = useSWR('/posts')

  return (
    <div className="pt-12">
      <Head>
        <title>Reddit Clone</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts?.map(post =>(
            <PostCard key={post.identifier} post={post} />
          ))}

        </div>
        {/* Sidebar */}
      </div>
    </div>
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