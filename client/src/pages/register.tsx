import Head from 'next/head'
import Link from 'next/link'

export default function Register() {
  return (
    <div className="flex">
      <Head>
        <title>Registro</title>
        <link rel="icon" href="/favicon.ico" />
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
          <form>
            <div className="mb-6">
              <input 
                type="checkbox" 
                className="mr-1 cursor-pointer" 
                id="agreement" 
              />
              <label 
                htmlFor="agreement"
                className="text-xs cursor-pointer"
                >Acepto recibir correos sobre cosas interesantes de Reddit-Clone
              </label>
            </div>
            <div className="mb-2">
              <input 
                type="email"
                className="w-full p-3 transition duration-200 border border-gray-400 rounded outline-none bg-gray-50 focus:bg-white hover:bog-white"
                placeholder="Correo"
              />
            </div>
            <div className="mb-2">
              <input 
                type="username"
                className="w-full p-3 transition duration-200 border border-gray-400 rounded outline-none bg-gray-50 focus:bg-white hover:bog-white"
                placeholder="Usuario"
              />
            </div>
            <div className="mb-2">
              <input 
                type="password"
                className="w-full p-3 transition duration-200 border border-gray-400 rounded outline-none bg-gray-50 focus:bg-white hover:bog-white"
                placeholder="Contraseña"
              />
            </div>
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
