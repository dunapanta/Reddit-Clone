import { Router, Request, Response } from 'express'
import Post from '../entities/Post'
import Sub from '../entities/Sub'

import auth from '../middleware/auth'

const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body

    const user = res.locals.user

    if(title.trim() === ''){
        return res.status(400).json({title: 'Debe contener un título'})
    }

    try{
        //Find sub
        // si no lo encuentra no hace falta arrojar error de nuestra cuenta
        const subRecord = await Sub.findOneOrFail({ name: sub})

        const post = new Post({ title, body, user, sub:subRecord })
        await post.save()
        return res.json(post)

    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Algo ha ido mal'})
    }

}
// Latest post
const getPost = async (_: Request, res: Response) => {
    try{
        const posts = await Post.find({ 
            order: { createdAt: 'DESC'}
            //relations: ['sub']
        })

        return res.json(posts)
    }catch(err){
        console.log(err)
        return res.json({ error: "Algo ha ido mal"})
    }
}

const router = Router()

router.post('/', auth, createPost)
router.get('/', getPost)

export default router