import { FormEvent, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios'
import { useRouter } from 'next/router'

import { useAuthDispatch, useAuthState } from '../context/auth'

import InputGroup from '../components/InputGroup'

export default function Register() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<any>({})

  const router = useRouter()

  // Para almacenar datos de login en el contexto
  const dispatch = useAuthDispatch()
  // Para saber si ya esta authenticado y quiere ir a login page redireccionar a home
  const { authenticated } = useAuthState()
  if(authenticated) router.push('/')

  const submitForm = async (event: FormEvent) => {
      event.preventDefault()

      try{
         const res = await Axios.post('/auth/login', {
            username, 
            password
        }/* , { withCredentials: true } */) //para cookies, pero mejor lo incluyo en _app.tsx globalmente

        dispatch({ type: 'LOGIN', payload: res.data })

      /* router.push('/') */
      router.back()

      }catch(err){
        console.log(err)
        setErrors(err.response.data)
      }
  
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div 
        className="w-40 h-screen bg-center bg-cover" 
        style={{ backgroundImage: "url('/images/colors.jpg')" }}>
      </div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Iniciar Sesión</h1>
          <p className="mb-10 text-xs">
            Al continuar, acepta nuestro Acuerdo de Usuario y Politica de Privacidad
          </p>
          <form onSubmit={submitForm}>
            <InputGroup className="mb-2" type="text" value={username} setValue={setUsername}
                        placeholder="Usuario" error={errors.username}
            />
            <InputGroup className="mb-4" type="password" value={password} setValue={setPassword}
                        placeholder="Contraseña" error={errors.password}
            />
            <button
              className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
            >
              Inicar Sesión
            </button>
          </form>
          <small>
            No tienes cuenta? 
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Registrarse</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}
