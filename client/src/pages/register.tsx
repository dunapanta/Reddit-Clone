import { FormEvent, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Axios from 'axios'
import { useRouter } from 'next/router'

import InputGroup from '../components/InputGroup'

export default function Register() {

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agreement, setAgreement] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const router = useRouter()

  const submitForm = async (event: FormEvent) => {
      event.preventDefault()

      /* if(!agreement){
        setErrors({...errors, agreememt: "Acepte lo terminos y condiciones"})
        return
      } */
      try{
         await Axios.post('/auth/register', {
            email, 
            username, 
            password
        })

      router.push('/login')

      }catch(err){
        console.log(err)
        setErrors(err.response.data)
      }
  
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Registro</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div 
        className="w-40 h-screen bg-center bg-cover" 
        style={{ backgroundImage: "url('/images/colors.jpg')" }}>
      </div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Registro</h1>
          <p className="mb-10 text-xs">
            Al continuar, acepta nuestro Acuerdo de Usuario y Politica de Privacidad
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input 
                type="checkbox" 
                className="mr-1 cursor-pointer" 
                id="agreement" 
                checked={agreement}
                onChange={e => setAgreement(e.target.checked)}
              />
              <label 
                htmlFor="agreement"
                className="text-xs cursor-pointer"
                >Acepto recibir correos sobre cosas interesantes de Reddit-Clone
              </label>
            </div>
            <InputGroup className="mb-2" type="email" value={email} setValue={setEmail}
                        placeholder="Correo" error={errors.email}
            />
            <InputGroup className="mb-2" type="text" value={username} setValue={setUsername}
                        placeholder="Usuario" error={errors.username}
            />
            <InputGroup className="mb-4" type="password" value={password} setValue={setPassword}
                        placeholder="Contraseña" error={errors.password}
            />
            <button
              className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
            >
              Registrarse
            </button>
          </form>
          <small>
            Ya tienes una cuenta? 
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Iniciar Sesión</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}
