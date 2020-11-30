import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index} from "typeorm";

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
    @Column({ unique: true })
    email: string

    @Index()
    @Column({ unique: true })
    username: string

    @Column()
    password: string

}
