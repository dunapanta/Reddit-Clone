import Axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import dayjs from 'dayjs'
import relativeTime from  'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import classNames from 'classnames'

import Sidebar from "../../../../components/Sidebar";
import { Post } from "../../../../types";
import { useAuthState } from "../../../../context/auth";

// para el tiempo en ves de momentjs
dayjs.extend(relativeTime)


export default function PostPage() {

    const router = useRouter()
    const { identifier, sub, slug } = router.query

    const { authenticated } = useAuthState()

    const { data: post, error } = useSWR<Post>((identifier && slug) ? `/posts/${identifier}/${slug}` : null)
    if(error) router.push('/')

    const vote = async (value: number) => {
        //if not logged in go to login
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

    return(
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            <Link href={`/r/${sub}`}>
                <a>
                    <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                        <div className="container flex">
                            {post && (
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                    <Image
                                        src={post.sub.imageUrl}
                                        height={8 * 16 / 4}
                                        width={8 * 16 / 4}
                                    />
                                </div>
                            )}
                            <p className="text-xl font-semibold text-white">
                                /r/{sub}
                            </p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className="container flex pt-5">
                {/* Post */}
                <div className="w-160">
                    <div className="bg-white rounded">
                        {post && (
                            <div className="flex">
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
                                <div className="p-2">
                                <div className="flex items-center">
                                        <p className="text-xs text-gray-500">
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
                                    {/* Post title */}
                                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                    {/* Post body */}
                                    <p className="my-3 text-sm">{post.body}</p>
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
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                {post && <Sidebar sub={post.sub}/>}
            </div>
        </>
    )
}