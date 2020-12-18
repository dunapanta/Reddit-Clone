// Miscelanuous extra routes that need the app in this case for Votes

import { Router, Request, Response } from 'express'
import Comment from '../entities/Comment'
import Post from '../entities/Post'
import User from '../entities/User'
import Vote from '../entities/Vote'

import auth from '../middleware/auth'

const vote = async (req: Request, res: Response) => {
    const { identifier, slug, commentIdentifier, value } = req.body

    // Validate vote value
    if(![-1, 0, 1].includes(value)){
        return res.status(400).json({ value : "Solo se acepan valores: -1, 0 o 1"})
    }

    try{
        const user: User = res.locals.user
        let post = await Post.findOneOrFail({ identifier, slug })
        let vote: Vote | undefined
        let comment: Comment | undefined

        if(commentIdentifier){
            //if there is a comment identifier find vote by comment
            comment = await Comment.findOneOrFail({ identifier: commentIdentifier })
            vote = await Vote.findOne({ user, comment })
        }else{
            // Else find vote by post
            vote = await Vote.findOne({ user, post })
        }

        if(!vote && value === 0){
            // if no vote and value = 0 return error
            return res.status(404).json({ error: "Voto no encontrado"})
        } else if (!vote){
           // entra si no hay voto lo crea
           vote = new Vote({ user, value })
           // Para ver si es para comentario o para post
           if(comment) {
               vote.comment = comment
           } else {
               vote.post = post
           }
           // Guarda el voto
           await vote.save()
        } else if(value === 0){
            // if vote exist and value = 0 remove vote from DB
            await vote.remove()
        } else if (vote.value !== value){
            // if vote and value has changed, update vote
            vote.value = value
            await vote.save()
        }

        post = await Post.findOneOrFail({ identifier, slug}, { relations: ['comments', 'comments.votes', 'sub', 'votes'] })

        post.setUserVote(user)
        post.comments.forEach( c => c.setUserVote(user))

        return res.json(post)

    }catch(err){
        console.log(err)
        return res.status(500).json({ error: "Algo ha salido mal"})
    }
}

const router = Router()
router.post('/vote', auth, vote)

export default router