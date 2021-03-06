import { FormEvent, useEffect, useState } from "react";
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
import { Post, Comment } from "../../../../types";
import { useAuthState } from "../../../../context/auth";

// para el tiempo en ves de momentjs
dayjs.extend(relativeTime)


export default function PostPage() {

    const router = useRouter()
    //Local State
    const [newComment, setNewComment] = useState('')
    const [description, setDescription] = useState('')

    const { identifier, sub, slug } = router.query

    const { authenticated, user } = useAuthState()

    const { data: post, error } = useSWR<Post>((identifier && slug) ? `/posts/${identifier}/${slug}` : null)
    const { data: comments, revalidate } = useSWR<Comment[]>((identifier && slug) ? `/posts/${identifier}/${slug}/comments` : null)

    if(error) router.push('/')

    // useEffect for metatag
     useEffect( () => {
        if(!post){
            return
        }
        let desc = post.body || post.title
        desc = desc.substring(0, 158).concat('..')
        setDescription(desc)
    }, [post])

    const vote = async (value: number, comment?: Comment) => {
        //if not logged in go to login
        if(!authenticated){
            router.push('/login')
        }

        //if vote is the same reset vote for either for post or comment
        if((!comment && value === post.userVote) || (comment && comment.userVote === value)){
            value = 0
        }
        
        try{
            await Axios.post('/misc/vote', {
                identifier: post.identifier,
                slug: post.slug,
                commentIdentifier: comment?.identifier, // if the comment is null or undefined this will not be send
                value: value
            })
            
            revalidate() //de swr fetch the data again for update the ui
        }catch(err){
            console.log(err)
        }
    }

    const submitComment = async (event: FormEvent) => {
        event.preventDefault()

        if(newComment.trim() === '') return

        try{
            await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, { body: newComment })
            setNewComment('')
            revalidate()
        }catch(err){
            console.log(err)
        }
    }

    return(
        <>
            <Head>
                <title>{post?.title}</title>
                <meta 
                name="description" 
                content={description}
                ></meta>
                <meta property="og:description" content={description} /> {/* open graph meta tags used by facebook to index pages on facebook and show some info about them*/}
                <meta property="og:title" content={post?.title} />
                <meta property="twitter:title" content={post?.title} />
                <meta property="twitter:description" content={description} />
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
                <div className="px-3 w-160 md:w-160">
                    <div className="bg-white rounded">
                        {post && (
                            <>
                            <div className="flex">
                                {/* Vote section */}
                                <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
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
                            {/* Comment input area */}
                            <div className="pl-10 pr-6 mb-4">
                                {authenticated ? (
                                    <div>
                                        <p className="mb-1 text-xs">
                                            Comentar como {' '}
                                            <Link href={`/u/${user.username}`}>
                                                <a className="font-semibold text-blue-500">
                                                    {user.username}
                                                </a>
                                            </Link>
                                        </p>
                                        <form onSubmit={submitComment}>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                                onChange={ e => setNewComment(e.target.value) }
                                                value={newComment}>
                                            </textarea>
                                            <div className="flex justify-end">
                                                <button className="px-3 py-1 blue button" disabled={newComment.trim() === ''}>Comentar</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                                        <p className="text-sm font-semibold text-gray-400">Inicia sesión o registrate para dejar un comentario</p>
                                        <div className="flex">
                                            <Link href="/login">
                                                <a className="flex-shrink-0 px-1 py-2 mr-2 max-w-2 hollow blue button">Iniciar Sesión</a>
                                            </Link>
                                            <Link href="/login">
                                                <a className="px-1 py-2 blue button">Registrarse</a>
                                            </Link>
                                        </div>
                                    </div>
                                )}       
                            </div>
                            <hr />
                            {/* Comments feed  */}

                            {comments?.map(comment => ( 
                                <div className="flex" key={comment.identifier}>
                                    {/* Vote section */}
                                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                                        {/* UpVote */}
                                        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={ () => vote(1, comment)}>
                                            <i className={classNames('icon-arrow-up', {
                                            'text-red-500': comment.userVote === 1
                                            })}></i>
                                        </div>
                                        <p className="text-xs font-bold">{comment.voteScore}</p>
                                        {/* DownVote */}
                                        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600" onClick={ () => vote(-1, comment)}>
                                        <i className={classNames('icon-arrow-down', {
                                            'text-blue-600': comment.userVote === -1
                                            })}></i>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="mb-1 text-xs leading-none">
                                            <Link href={`/u/${comment.username}`}>
                                                <a className="mr-1 font-bold hover:underline">
                                                    {comment.username}
                                                </a>
                                            </Link>
                                            <span className="text-gray-600">
                                                {`${comment.voteScore} puntos • ${dayjs(comment.createdAt).locale("es").fromNow()}`}
                                            </span>
                                        </p>
                                        <p>{comment.body}</p>
                                    </div>
                                </div>
                        )) }
                        </>
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                {post && <Sidebar sub={post.sub}/>}
            </div>
        </>
    )
}