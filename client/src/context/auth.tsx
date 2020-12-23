import { createContext } from "react";
import { User } from "../types"

interface State {
    authenticated: boolean
    user: User
}

const StateContext = createContext<State>({
    authenticated: false,
    user: null
})