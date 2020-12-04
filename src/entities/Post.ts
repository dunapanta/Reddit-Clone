import { IsEmail, Length } from "class-validator";
import {Entity as TOEntity, Column, Index, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'

import Entity from './Entity'

@TOEntity("posts")
export default class Post extends Entity{

    // Partial means some of the fields can be nulable
    constructor(post: Partial<Post>){
        super()
        Object.assign(this, post)
    }

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 6)
    }
    
}
