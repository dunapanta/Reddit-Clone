import { IsEmail, Length } from "class-validator";
import {Entity as TOEntity, Column, Index, BeforeInsert, OneToMany} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'

import Entity from './Entity'
import Post from "./Post";

@TOEntity("users")
export default class User extends Entity{

    // Partial means some of the fields can be nulable
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Index()
    @Length(3, 50, { message: "Username must be at least 3 characters long"})
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, 50)
    password: string

    @OneToMany( () => Post, post => post.user )
    posts: Post[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 6)
    }
    
}
