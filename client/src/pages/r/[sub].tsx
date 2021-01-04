import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from 'swr'
import Image from 'next/image'

import PostCard from "../../components/PostCard";
import { Sub } from "../../types";


export default function SubPage(){
    const router = useRouter()

    const subName = router.query.sub

    //en SWR si se pasa null no hace ninguna llamada
    const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null)

    if(error) router.push('/')

    let postsMarkup

    if(!sub){
        postsMarkup = <p className="text-lg text-center">Cargando...</p>
    } else if (sub.posts.length === 0){
        postsMarkup = <p className="text-lg text-center">No hay posts que mostrar</p>
    } else {
        postsMarkup = sub.posts.map( post => (
            <PostCard key={post.identifier} post={post} />
        ))
    }

    return(
        <div>
            <Head>
                <title>
                    {sub?.title}
                </title>
            </Head>
            { sub && (
                <Fragment>
                    {/* Sub info and images */}
                    <div>
                        {/* Banner Image */}
                        <div className="bg-blue-500">
                            {sub.bannerUrl ? (
                                <div className="h-56 bg-blue-500" style={{
                                    backgroundImage: `url(${sub.bannerUrl})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'

                                }}></div>
                            ): (
                                <div className="h-20 bg-blue-500"></div>
                            )}
                        </div>
                        {/* Sub meta data */}
                        <div className="h-20 bg-white">
                            <div className="container flex">
                                <Image
                                    src={sub.imageUrl}
                                    alt="Sub"
                                    className="rounded-full"
                                    width={80}
                                    height={80}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Posts & Sidebar */}
                    <div className="container flex pt-5">
                        <div className="w-160">
                            {postsMarkup}
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    )
        
}