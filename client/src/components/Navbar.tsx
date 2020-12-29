import Link from 'next/link'
import RedditLogo from '../images/reddit.svg'
import { Fragment } from 'react'

import { useAuthState, useAuthDispatch } from '../context/auth'
import Axios from 'axios'

const Navbar:React.FC = () => {

  const { authenticated } = useAuthState()
  const dispatch = useAuthDispatch()

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

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link href="/">
              <a>
                <RedditLogo className="w-8 h-8 mr-2" />
              </a>
            </Link>
            <span className="text-2xl font-semibold">
              <Link href="/">Reddit Clone</Link>
            </span>
          </div>
          {/* Search Input */}
          <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
            <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
            <input 
              type="text"
              className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
              placeholder="Buscar"
            />
          </div>
          {/* Auth Buttons */}
          <div className="flex">
            { authenticated ? (
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
            )}
          </div>
        </div>
    )
}

export default Navbar