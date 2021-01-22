import Axios from 'axios'
import Head from 'next/head'
import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from  'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import useSWR, { useSWRInfinite } from 'swr'
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

  //Infinite Scroll kepp track of the current observed post
  const [observedPost, setObservedPost] = useState('')

  const { authenticated } = useAuthState()

  /* Usando SWR */
  //const { data: posts } = useSWR('/posts')
  const { data: topSubs } = useSWR('/misc/top-subs')

  //Infinite Scroll

  const { data, error, mutate, size: page, setSize: setPage, isValidating } 
  = useSWRInfinite<Post[]>(
      index =>
        `/posts?page=${index}`,
    );

    const posts: Post[]= data ? [].concat(...data) : [];

  useEffect( () => {
    // si es falsy o se no hay posts
    if(!posts || posts.length === 0) return

    //access the id of the bottom posts
    const id = posts[posts.length -1].identifier

    // si es uno nuevo para seguir a este
    if(id !== observedPost){
      setObservedPost(id)
      // es mejor no usar observedPost porque puede que no haya cambiado todavia
      observeElement(document.getElementById(id))
    }

  }, [posts])

  const observeElement = (element: HTMLElement) => {
    // si el elemento aun no esta renderizado en el DOM
    if(!element) return

    // IntersectionObserver viene en Intersection API, toma dos argumentos callback y options
    // entries are like points on the div itself we just gonna track one point, el callback se ejecuta cuando llega a la interseccion
    // el segundo argumento options tiene threshold en donde 0 es el top y 1 bottom
    const observer = new IntersectionObserver( (entries) => {
      if(entries[0].isIntersecting === true){
        // codigo cuando llega a la interseccion
        console.log('Post final')
        setPage(page +1)
        observer.unobserve(element)
      }
    }, { threshold: 1 })
    // observamos el elemento osea el ultimo post
    observer.observe(element)
  }

  return (
    <Fragment>
      <Head>
        <title>Reddit Clone</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-full px-3 md:w-160 md:p-0">
          { isValidating && (
            <p className="text-lg text-center">Cargando posts..</p>
          )}
          {posts?.map(post =>(
            <PostCard key={post.identifier} post={post} />
          ))}
          { isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Cargando más posts..</p>
          )}

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