import Axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types"

interface State {
    authenticated: boolean
    user: User | undefined
}

interface Action {
    type: string
    payload: any
}

const StateContext = createContext<State>({
    authenticated: false,
    user: null
})

const DispatchContext = createContext(null)

const reducer = (state: State, { type, payload } : Action ) => {
    switch(type){
        case 'LOGIN':
            return{
                ...state, // para no tener mutaciones
                authenticated: true,
                user: payload
            }
        case 'LOGOUT':
            return{
                ...state,
                authenticated: false,
                user: null
            }
        default:
            throw new Error(`Acción desconocida ${type}`)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(reducer, {
        user: null,
        authenticated: false
    })

    /* const dispatchDestructure = (type: string, payload?: any) => dispatch({ type, payload }) */

    //Para estar logeado si tengo una cookie valida (en casos de que recargo la pagina)
    useEffect( () => {
        async function loadUser() {
            try{
                const res = await Axios.get('/auth/me')
                dispatch({ type: 'LOGIN', payload: res.data })
            }catch(err){
                console.log(err)
            }
        }
        loadUser()
    }, [])
    
    //La ventaja de utilizar estos dos providers en vez de estar destructurando puedo utilizarlo asi -- const dispatch = useAuthDispatch() -- como en login.tsx
    // y te salva del nested destructuring
    return(
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)