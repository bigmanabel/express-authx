import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { ApiKey } from './api-key.entity';
import { Role } from '../enums/role.enum'; 

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.Regular })
    role: Role;

    @OneToMany(() => ApiKey, apiKey => apiKey.user)
    apiKeys: ApiKey[];
}
