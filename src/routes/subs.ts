import { NextFunction, Request, Response, Router } from 'express'
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'

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

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
    const user: User = res.locals.user

    try{
        const sub = await Sub.findOneOrFail({ where: { name: req.params.name }})

        if(sub.username !== user.username){
            return res.status(403).json({ error : 'Este Sub no te pertenece'})
        }

        res.locals.sub = sub

        return next()
    }catch(err){  
        return res.status(500).json({ error: "Algo ha ido mal" })
    }
}

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

const uploadSubImage = async (req: Request, res: Response) => {
    const sub: Sub = res.locals.sub
    try{
        const type = req.body.type

        if(type !== 'image' && type !== 'banner'){
            //fs elimina el archivo
            fs.unlinkSync(req.file.path)
            return res.status(400).json({ error: "Tipo invalido"})
        }
        
        let oldImageUrn: string = ''
        if(type === 'image'){
            oldImageUrn = sub.imageUrn || ''
            sub.imageUrn = req.file.filename
        } else if (type === 'banner'){
            oldImageUrn = sub.bannerUrn || ''
            sub.bannerUrn = req.file.filename
        }

        await sub.save()

        if(oldImageUrn !== ''){
            fs.unlinkSync(`public\\images\\${oldImageUrn}`)
        }

        return res.json(sub)

    }catch(err){
        return res.status(500).json({ error: "Algo ha ido mal"})
    }
}

const searchSubs =  async (req: Request, res: Response) => {
    try{
        const name = req.params.name

        if (isEmpty(name)){
            return res.status(400).json({ error : 'Name no debe estar vacio'})
        }

        // en Next 10 se tiene case sensitive router es decir puede ser diferente reactJS a reactjs
        // primero convierto name a lowercase para compararlo con todos los subs de la base de datos y tambien los convierto a lowercase
        const subs = await getRepository(Sub)
                        .createQueryBuilder()
                        .where('LOWER(name) LIKE :name', { name: `${name.toLowerCase().trim()}%` })
                        .getMany()
        
        return res.json(subs)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Algon ha ido mal'})
    }
}

const router = Router()

router.post('/', user, auth, createSub)
router.get('/:name', user, getSub)
router.get('/search/:name', searchSubs)
// el usuario necesita estar autenticado y ser el dueño para subir la imagen
router.post('/:name/image', user, auth, ownSub, upload.single('file'), uploadSubImage)

export default router
