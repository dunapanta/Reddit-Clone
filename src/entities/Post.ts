import {Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, BeforeInsert} from "typeorm";
import { makeId, slugify } from "../util/helpers";

import Entity from './Entity'
import User from "./User";

@TOEntity("posts")
export default class Post extends Entity{

    // Partial means some of the fields can be nulable
    constructor(post: Partial<Post>){
        super()
        Object.assign(this, post)
    }
    
    @Index()
    @Column()
    idetifier: string //7 caracthers

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

    @ManyToOne( () => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @BeforeInsert()
    makeIdAndSlug(){
        this.idetifier = makeId(7)
        this.slug = slugify(this.title)
    }
}
