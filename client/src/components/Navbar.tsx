import Link from 'next/link'
import RedditLogo from '../images/reddit.svg'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'

import { useAuthState, useAuthDispatch } from '../context/auth'
import Axios from 'axios'
import { Sub } from '../types'
import { useRouter } from 'next/router'

const Navbar:React.FC = () => {

  const [name, setName] = useState('')
  const [subs, setSubs] = useState<Sub[]>([])
  const [timer, setTimer] = useState(null)

  const { authenticated, loading } = useAuthState()
  const dispatch = useAuthDispatch()

  const router = useRouter()

  const logout = () => {
    //En el servidor esta como crear una nueva cookie expirada
    Axios.get('/auth/logout')
    .then( () => {
      dispatch({
        type: 'LOGOUT'
      })
      //reload the entire page save us from  the hassle of changing state and refetching posts simply reload the page
      // some dont like reload on a SPA but Facebook and Reddit to this is really fast and you just not aware of it
      window.location.reload()
    })
    .catch(err => console.log(err))
  }

  // to better user experience not to fetch data every time the user type on seach bar
  useEffect( () => {
    if(name.trim() === ''){
      clearTimeout(timer)
      //cuando el usuario borra todo lo que tipeo vacia el arreglo
      setSubs([])
      return
    }
    searchSubs()

  }, [name])

  const searchSubs = async () => {
    clearTimeout(timer)
    setTimer(setTimeout(async () => {
      try{
        const { data } = await Axios.get(`/subs/search/${name}`)
        setSubs(data)
        console.log(data)
  
      }catch(err){
        console.log(err)
      }
    }, 250))
  }

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`)
    setName('')
  }

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link href="/">
              <a>
                <RedditLogo className="w-8 h-8 mr-2" />
              </a>
            </Link>
            <span className="hidden text-2xl font-semibold lg:block">
              <Link href="/">Reddit Clone</Link>
            </span>
          </div>
          {/* Search Input */}
          <div className="max-w-full px-4 w-160">
            <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
              <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
              <input 
                type="text"
                className="py-1 pr-3 bg-transparent rounded focus:outline-none"
                placeholder="Buscar"
                value={name}
                onChange={ e => setName(e.target.value)}
              />
              {/* Search results */}
              <div className="absolute left-0 right-0 bg-white" style={{ top: '100%' }}>
                {subs?.map(sub => (
                  <div 
                    className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                    onClick={ () => goToSub(sub.name)}
                    key={sub.imageUrn}
                  >
                      <Image 
                        src={sub.imageUrl}
                        className="rounded-full"
                        alt='Sub'
                        height={(8 * 16) / 4}
                        width={(8 * 16) / 4}
                      />
                    <div className="ml-4 text-sm">
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-gray-600">{sub.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Auth Buttons */}
          <div className="flex">
            {/* loading para no mostrar los botones al momento de recargar la pagina */}
            { !loading && (authenticated ? (
              //Boton cerrar sesion
              <button 
              className="w-32 py-1 mr-4 leading-5 hollow blue button"
              onClick={logout}
              >
                Cerrar Sesión
              </button>
            ): (
              <Fragment>
                <Link href="/login">
                  <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                    Iniciar Sesión
                  </a>
                </Link>
                <Link href="/register">
                  <a className="w-32 py-1 leading-5 blue button">
                    Registrarse
                  </a>
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
    )
}

export default Navbar