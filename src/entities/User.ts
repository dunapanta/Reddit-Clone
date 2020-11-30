import { IsEmail, Length } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt'

@Entity("users")
export class User extends BaseEntity{

    // Partial means some of the fields can be nulable
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Index()
    @Length(3, 50, { message: "Username must be at least 3 characters long"})
    @Column({ unique: true })
    username: string

    @Column()
    @Length(6, 50)
    password: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 6)
    }

}
