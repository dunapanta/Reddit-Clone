import Link from 'next/link'
import { useRouter } from "next/router";
import dayjs from 'dayjs'
import relativeTime from  'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import classNames from 'classnames'


import { Post } from '../types'
import Axios from 'axios'
import { useAuthState } from '../context/auth'

// para el tiempo en ves de momentjs
dayjs.extend(relativeTime)

interface PostCardProps {
    post:Post
}

export default function PostCard({ post }: PostCardProps) {

    const router = useRouter()
    const { authenticated } = useAuthState()

    const vote = async (value: number) => {
        if(!authenticated){
          router.push('/login')
        }

        //if vote is the same reset vote
        if(value === post.userVote){
          value = 0
        }
        try{
            const res = await Axios.post('/misc/vote', {
                identifier: post.identifier,
                slug: post.slug,
                value: value
            })
            console.log(res.data)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div key={post.identifier} className="flex mb-4 bg-white rounded" id={post.identifier}>
              {/* Vote section */}
              <div className="w-10 py-4 text-center bg-gray-200 rounded-l">
                {/* UpVote */}
                <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={ () => vote(1)}>
                    <i className={classNames('icon-arrow-up', {
                      'text-red-500': post.userVote === 1
                    })}></i>
                </div>
                <p className="text-xs font-bold">{post.voteScore}</p>
                {/* DownVote */}
                <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600" onClick={ () => vote(-1)}>
                <i className={classNames('icon-arrow-down', {
                      'text-blue-600': post.userVote === -1
                    })}></i>
                </div>
              </div>
              {/* Post data section */}
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <img 
                      src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
                      className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                    />
                  </Link>
                  <Link href={`/r/${post.subName}`}>
                    <a className="text-xs font-bold hover:underline">
                      /r/{post.subName}
                    </a>
                  </Link>
                  <p className="text-xs text-gray-500">
                    <span className="mx-1">•</span> 
                    Posteado por
                    <Link href={`/u/${post.username}`}>
                      <a className="mx-1 hover:underline">
                        /u/{post.username}
                      </a>
                    </Link>
                   {/*  <Link href={`/r/${post.subName}/${post.identifier}/${post.slug}`}> */}
                   <Link href={post.url}>
                      <a className="mx-1 hover:underline">
                        {dayjs(post.createdAt).locale("es").fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">
                    {post.title}
                  </a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}
                
                {/* Buttons */}
                <div className="flex">
                  <Link href={post.url}>
                    <a >
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">{post.commentCount} Comentarios</span>
                      </div>
                    </a>
                  </Link>
                    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                      <i className="mr-1 fas fa-share fa-xs"></i>
                      <span className="font-bold">Compartir</span>
                    </div>
                    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                      <i className="mr-1 fas fa-bookmark fa-xs"></i>
                      <span className="font-bold">Guardar</span>
                    </div>
                </div>
              </div>
            </div>
    )
}