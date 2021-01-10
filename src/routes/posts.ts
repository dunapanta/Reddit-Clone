import { Router, Request, Response } from 'express'
import Comment from '../entities/Comment'
import Post from '../entities/Post'
import Sub from '../entities/Sub'

import auth from '../middleware/auth'
import user from "../middleware/user";

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
// Latest posts
const getPosts = async (_: Request, res: Response) => {
    try{
        const posts = await Post.find({ 
            order: { createdAt: 'DESC'},
            relations: ['comments', 'votes', 'sub'],
        })

        if(res.locals.user){
            posts.forEach(p => p.setUserVote(res.locals.user))
        }

        return res.json(posts)
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: "Algo ha ido mal"})
    }
}

// One post
const getPost = async (req: Request, res: Response) => {
    const {identifier, slug} = req.params
    try{
        const post = await Post.findOneOrFail({ identifier, slug }, {
            relations: ['sub', 'votes', 'comments']
        })

        if(res.locals.user){
            post.setUserVote(res.locals.user)
        }

        return res.json(post)
    }catch(err){
        console.log(err)
        return res.status(404).json({ error: "Post no encontrado"})
    }
}

//Comments on Post
const commentOnPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params
    const { body } = req.body

    try{
        const post = await Post.findOneOrFail({ identifier, slug })

        const comment = new Comment({
            body,
            user: res.locals.user,
            post
        })

        await comment.save()

        return res.json(comment)

    }catch(err){
        console.log(err)
        return res.status(404).json({error: "Post no encontrado"})
    }
}

const getPostComments = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params
    try{
        const post = await Post.findOneOrFail({ identifier, slug })

        const comments = await Comment.find({
            where: { post },
            order: { createdAt: 'DESC' },
            relations: ['votes']
        })

        if(res.locals.user){
            comments.forEach(c => c.setUserVote(res.locals.user))
        }

        return res.json(comments)
    } catch(err){
        console.log(err)
        return res.status(500).json({ error: "Algo ha ido mal"})
    }
}


const router = Router()

router.post('/', user, auth, createPost)
router.get('/:identifier/:slug', user, getPost) 
router.get('/', user, getPosts) //solo user retorna los posts en / sin necesidad de estar autenticado pero si hay user sirve para los votos que dio
router.post('/:identifier/:slug/comments', user, auth, commentOnPost)
router.get('/:identifier/:slug/comments', user, getPostComments)

export default router