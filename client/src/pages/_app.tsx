import { AppProps } from 'next/app'
import Axios from 'axios'
import { useRouter } from 'next/router'

import { AuthProvider } from '../context/auth'

import '../styles/globals.css'
import '../styles/icons.css'

import Navbar from '../components/Navbar'

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  /* const authRoute = pathname === '/register' || pathname == '/login' */
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)

  return (
    <AuthProvider>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
