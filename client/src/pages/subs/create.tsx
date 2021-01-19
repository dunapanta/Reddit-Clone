import Axios from "axios"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { FormEvent, useState } from "react"
import classNames from 'classnames'
import { useRouter } from "next/router"

export default function Create(){
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [errors, setErrors] = useState<Partial<any>>({})

    const router = useRouter()

    const submitForm =  async (event: FormEvent) =>{
        event.preventDefault()

        try{
            const res = await Axios.post('/subs', { name, title, description })

            router.push(`/r/${res.data.name}`)

        }catch(err){
            console.log(err)
            setErrors(err.response.data)
        }
    }

    return (
        <div className="flex bg-white">
            <Head>
                <title>Crear Comunidad</title>
            </Head>
            {/* Not using next Image here becouse is now trickywork with next image with dinamic heigth */}
            <div 
                className="w-40 h-screen bg-center bg-cover" 
                style={{ backgroundImage: "url('/images/comunity.jpg')" }}>
            </div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-98">
                    <h1 className="mb-3 text-lg font-medium">Crear Comunidad</h1>
                    <hr />
                    <form onSubmit={submitForm}>
                        <div className="my-6">
                            <p className="font-medium p">Nombre</p>
                            <p className="mb-2 text-xs text-gray-500">
                            Los nombres de las comunidades, incluidas las mayúsculas, no se pueden cambiar
                            </p>
                            <input 
                                className={ classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", { 'border-red-600': errors.name })}
                                type="text"
                                value={name}
                                onChange={ e => setName(e.target.value) }
                            />
                            <small className="text-red-600-font-medium">{errors.name}</small>
                        </div>
                        <div className="my-6">
                            <p className="font-medium p">Título</p>
                            <p className="mb-2 text-xs text-gray-500">
                            El título representa el tema de la comunidad
                            </p>
                            <input 
                                className={ classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", { 'border-red-600': errors.title })}
                                type="text"
                                value={title}
                                onChange={ e => setTitle(e.target.value) }
                            />
                            <small className="text-red-600-font-medium">{errors.title}</small>
                        </div>
                        <div className="my-6">
                            <p className="font-medium p">Descripción</p>
                            <p className="mb-2 text-xs text-gray-500">
                            Así los nuevos miembros saben de que trata tú cominidad
                            </p>
                            <textarea 
                                className={ classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", { 'border-red-600': errors.description })}
                                value={description}
                                onChange={ e => setDescription(e.target.value) }
                            />
                            <small className="text-red-600-font-medium">{errors.description}</small>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-4 py-1 text-sm font-semibold capitalize blue button">
                                Crear Comunidad
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


//not load this submit page if the user is not authenticated 
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try{
        const cookie = req.headers.cookie
        if(!cookie) throw new Error('Falta el token de cookie de autenticacion')

        //forward the cookie that we received
        await Axios.get('/auth/me', { headers: { cookie }})

        // return empty props becouse we just want to know if the user is authenticated
        return{ props: {}}

    }catch(err){
        // status code that starts with 3 are related to redirect and this redirect to login
        res.writeHead(307, { Location: '/login' }).end()
    }
}