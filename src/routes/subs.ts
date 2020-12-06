import { Request, Response, Router } from 'express'
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'

import User from '../entities/User'
import Sub from '../entities/Sub'
import auth from '../middleware/auth'

const createSub = async (req: Request, res: Response) => {
     const { name , title, description } = req.body

     const user: User = res.locals.user

     try {
        let errors: any = {}

        if(isEmpty(name)){
            errors.name = "Debe ingresar el nombre"
        }
        if(isEmpty(title)){
            errors.title = "Debe ingresar el título"
        }

        // validar si name ya fue creado ya sea con mayusculas o minusculas se usa querybuilder
        const sub = await getRepository(Sub)
            .createQueryBuilder('sub') //alias sub
            .where('lower(sub.name) = :name', { name: name.toLowerCase() })
            .getOne()

        if(sub) {
            errors.name = "Error el Sub ya existe"
        }

        if(Object.keys(errors).length > 0) {
            throw errors
        }


     }catch(err){
        return res.status(400).json(err)
     }

     try{
        const sub = new Sub({ name, description, title, user })
        await sub.save()

        return res.json(sub)
     }catch(err){
         console.log(err)
         return res.status(500).json({ error: "Algo ha ido mal"})
     }
}

const router = Router()

router.post('/', auth, createSub)

export default router
