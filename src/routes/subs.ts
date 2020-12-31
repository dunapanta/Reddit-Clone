import { Request, Response, Router } from 'express'
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'

import User from '../entities/User'
import Sub from '../entities/Sub'
import auth from '../middleware/auth'
import user from "../middleware/user";
import Post from '../entities/Post'
import { makeId } from '../util/helpers'

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

const getSub = async (req: Request, res: Response) => {
    const name = req.params.name

    try{
        const sub = await Sub.findOneOrFail({ name })
        const posts = await Post.find({ 
            where: { sub },
            order: { createdAt: 'DESC' },
            relations: ['comments', 'votes']
        })

        sub.posts = posts

        if(res.locals.user){
            sub.posts.forEach(p => p.setUserVote(res.locals.user))
        }

        return res.json(sub)

    }catch(err){
        console.log(err)
        return res.status(404).json({ sub: 'Sub no encontrado'})
    }
}

// Multer para imagenes
const upload = multer({
    storage: multer.diskStorage({
        destination: 'public/images',
        filename: (_, file, callback) => {
            const name = makeId(15)
            callback(null, name + path.extname(file.originalname)) // ej sjdfhsdkj8873 +. png
        }
    }),
    fileFilter: (_ , file: any, callback: FileFilterCallback) => {
        // verificar si es una imagen
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('No es una imagen'))
        }
    }
})

const uploadSubImage = async (_: Request, res: Response) => {
    return res.json({ success: true})
}

const router = Router()

router.post('/', user, auth, createSub)
router.get('/:name', user, getSub)
// el usuario necesita estar autenticado y ser el dueño para subir la imagen
router.post('/:name/image', user, auth, upload.single('file'), uploadSubImage)

export default router
