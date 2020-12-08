import { Request, Response, Router } from "express";
import { isEmpty, validate } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import User from "../entities/User";
import auth from '../middleware/auth'

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    try{
        //Validate data
        let errors: any = {}

        const emailUser = await User.findOne({ email })
        const usernameUser = await User.findOne({ username })

        if(emailUser) errors.email = "Email is already taken"
        if(usernameUser) errors.username = "Username is already taken"

        if(Object.keys(errors).length > 0){
            return res.status(400).json(errors)
        }

        //Create the user
        const user = new User({ email, username, password })

        errors = await validate(user)
        if(errors.length > 0){
            return res.status(400).json({ errors })
        }

        await user.save()

        //Return the user
        return res.json(user)

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    try{
        let errors: any = {}

        if(isEmpty(username)) errors.username = 'Ingrese el nombre de usuario'
        if(isEmpty(password)) errors.password = 'Ingrese la contraseña'
        if(Object.keys(errors).length > 0){
            return res.status(400).json(errors)
        }

        const user = await User.findOne({ username })

        if(!user){
            return res.status(404).json({error: 'Usuario no encontrado'})
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if(!passwordMatches){
            return res.status(401).json({ password: 'Contraseña incorrecta' })
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET!)
        // set the cookie, the client takes the value of this header and stored on the machine as a cookie
        // httpOnly the cookie can not be access by javascript
        // secure the cookie should only be trasnsfer throug https
        // sameSite this cookie should only came from our domain
        // maxAge time of expiration
        // path where the cookie is valid
        res.set('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        }))

        return res.json(user)

    }catch(err){
        console.log(err)
        return res.json({ error: "Algo ha ido mal"})
    }
}

// when the user send request to this route, return if is authenticated and who this user is
const me = (_: Request, res: Response) => {
    return res.json(res.locals.user)
}

// set the cookie with the same name but expires to 0 so the browser delete the cookie
const logout = (_: Request, res: Response) => {

    res.set('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
    }))

    return res.status(200).json({ success: true})
}

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, me)
router.get('/logout', auth, logout)

export default router