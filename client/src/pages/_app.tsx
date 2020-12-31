import { AppProps } from 'next/app'
import Axios from 'axios'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import { AuthProvider } from '../context/auth'

import '../styles/globals.css'
import '../styles/icons.css'

import Navbar from '../components/Navbar'
import { deserialize } from 'class-transformer'

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  /* const authRoute = pathname === '/register' || pathname == '/login' */
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)

  return (
    //dedupingInterval si el usuario trata de obtener otra vez los datos en ese tiempo mejor se saca de cache y se evita volver a hacer la llamada
    <SWRConfig 
      value={{
        fetcher: (url) => Axios.get(url).then(res => res.data),
        dedupingInterval: 10000
      }}
    >
        <AuthProvider>
        {!authRoute && <Navbar />}
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  )
}

export default MyApp
