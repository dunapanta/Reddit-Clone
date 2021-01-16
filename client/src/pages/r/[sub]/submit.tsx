import { FormEvent, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router'
import Axios from 'axios';

import Sidebar from "../../../components/Sidebar";
import { Post, Sub } from '../../../types';
import Head from 'next/head';

export default function Submit() {
    
    const [title, setTitle] = useState('') 
    const [body, setBody] = useState('')

    const router = useRouter()
    const { sub: subName } = router.query

    const { data: sub, error } = useSWR<Sub>( subName ? `/subs/${subName}`: null)
    //si el SubName no existe 
    if(error) {
        router.push('/')
    }

    const submitPost = async (event: FormEvent) => {
        event.preventDefault()

        if(title.trim() === ''){
            return
        }

        try{
            //return type post
            const { data: post } = await Axios.post<Post>('/posts', { title, body, sub: sub.name })

            router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`)

        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="container flex pt-5">
            <Head>
                <title>Enviar a Reddit Clone</title>
            </Head>
            <div className="w-160">
                <div className="p-4 bg-white rounded">
                    <h1 className="mb-3 text-lg">Enviar post a /r/{subName}</h1>
                    <form onSubmit={submitPost}>
                        <div className="relative mb-2">
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                                placeholder="Tìtulo"
                                maxLength={300}
                                value={title}
                                onChange={ e => setTitle(e.target.value)}
                            />
                            {/* Counter Max 300 characters for title  ej 63/300*/}
                            <div className="absolute mb-2 text-sm text-gray-500 selected-none focus:border-gray-600"
                                style={{ top: 11, right: 10}}
                            >
                                {title.trim().length}/300
                            </div>
                        </div>
                        <textarea 
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                            value={body}
                            placeholder="Texto (opcional)"
                            onChange={ e => setBody(e.target.value )}
                            rows={4}
                        >
                        </textarea>
                        <div className="flex justify-end">
                            <button 
                                className="px-3 py-1 blue button"
                                type="submit"
                                disabled={title.trim().length === 0}
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {sub && <Sidebar sub={sub}/>}
        </div>
    )
}