import {Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import { makeId, slugify } from "../util/helpers";
import { Exclude, Expose } from "class-transformer";

import Entity from './Entity'
import User from "./User";
import Sub from "./Sub"
import Comment from "./Comment"
import Vote from "./Vote";

@TOEntity("posts")
export default class Post extends Entity{

    // Partial means some of the fields can be nulable
    constructor(post: Partial<Post>){
        super()
        Object.assign(this, post)
    }
    
    @Index()
    @Column()
    identifier: string //7 caracthers

    @Column()
    title: string

    // name of the post in the url
    @Index()
    @Column()
    slug: string

    @Column({ nullable: true, type: 'text'})
    body: string

    // nabe of the sub that this post belongs to
    @Column()
    subName: string

    // no se lo incluye por defecto en la respuesta por eso lo pongo explicitamente
    @Column()
    username: string

    // primer argunmento mlo que va a retornar, el segundo para hacer fetch
    @ManyToOne( () => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne( () => Sub, sub => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Sub

    @Exclude()
    @OneToMany( () => Comment, comment => comment.post)
    comments: Comment[]

    @OneToMany( () => Vote, vote => vote.post)
    votes: Vote[]

    //Enviar url de posts desde el servidor
    @Expose() get url(): string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`
    }

    // another virtual field para el total de comentarios
    @Expose() get commentCount(): number {
        return this.comments?.length
    }

    // obtener el conteo de votos
    @Expose() get voteScore(): number {
        return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
    }

    // check the votes submmited to this post and the vote that this user submited and find intersection between them
    protected userVote: number
    setUserVote(user: User){
        const index = this.votes?.findIndex(v => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
    }

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}
