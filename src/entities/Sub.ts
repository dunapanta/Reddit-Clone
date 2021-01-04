import {Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, OneToMany} from "typeorm";

import Entity from './Entity'
import User from "./User";
import Post from './Post'
import { Expose } from "class-transformer";

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

    @Column()
    username: string

    @ManyToOne( () => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]

    // url is the full url and urn is just the name
    // this function returns the domain concat with the image urn or gravatar placeholder if there is no image
    @Expose()
    get imageUrl(): string {
        return this.imageUrn ? `${process.env.APP_URL}/images/${this.imageUrn}` : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    }

    //Banner
    @Expose()
    get bannerUrl(): string | undefined {
        return this.bannerUrn ? `${process.env.APP_URL}/images/${this.bannerUrn}` : undefined
    }
    
}
