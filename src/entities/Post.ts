import {Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import { makeId, slugify } from "../util/helpers";
import { Expose } from "class-transformer";

import Entity from './Entity'
import User from "./User";
import Sub from "./Sub"
import Comment from "./Comment"

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

    @OneToMany( () => Comment, comment => comment.post)
    comments: Comment[]

    //Enviar url de posts desde el servidor
    @Expose() get url(): string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`
    }

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}
