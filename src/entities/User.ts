import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from './Reservation';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservations!: Reservation[];

    constructor(email: string, name: string) {
        this.email = email;
        this.name = name;
    }
}
