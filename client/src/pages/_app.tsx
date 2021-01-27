import { AppProps } from 'next/app'
import Axios from 'axios'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import { AuthProvider } from '../context/auth'

import '../styles/globals.css'
import '../styles/icons.css'

import Navbar from '../components/Navbar'
import { deserialize } from 'class-transformer'

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api'
Axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
  try{
    const res = await Axios.get(url)
    return res.data
  }catch(err){
    throw err.response.data
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  /* const authRoute = pathname === '/register' || pathname == '/login' */
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)

  return (
    //dedupingInterval si el usuario trata de obtener otra vez los datos en ese tiempo mejor se saca de cache y se evita volver a hacer la llamada
    <SWRConfig 
      value={{
        fetcher,
        dedupingInterval: 10000
      }}
    >
        <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  )
}

export default MyApp
