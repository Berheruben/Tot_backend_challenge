import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('timestamp')
    date!: Date;

    @ManyToOne(() => User, (user) => user.reservations)
    user!: User;

    @Column()
    table!: number;

    constructor(date: Date, user: User, table: number) {
        this.date = date;
        this.user = user;
        this.table = table;
    }
}
