import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('api-keys')
export class ApiKey {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    key: string;

    @Column()
    uuid: string;

    @ManyToOne(() => User, user => user.apiKeys)
    user: User;
}
