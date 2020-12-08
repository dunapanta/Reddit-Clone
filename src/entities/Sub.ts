import {Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, OneToMany} from "typeorm";

import Entity from './Entity'
import User from "./User";
import Post from './Post'

@TOEntity("subs")
export default class Sub extends Entity{

    // Partial means some of the fields can be nulable
    constructor(sub: Partial<Sub>){
        super()
        Object.assign(this, sub)
    }

    @Index()
    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable:true })
    description: string

    // store the name of the file unique resource name
    @Column({nullable:true })
    imageUrn: string

    @Column({nullable:true })
    bannerUrn: string

    @ManyToOne( () => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]
    
}
