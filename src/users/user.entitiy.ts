import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  hash: string;

  @Column({ default: true })
  isActive: string;
}