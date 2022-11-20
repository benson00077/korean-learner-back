import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  hash: string;

  @Column({ default: true })
  isActive: string;

  @ManyToMany(() => SentenceKo, (sentenceKo) => sentenceKo.users, {
    cascade: ['insert', 'update']
  })
  @JoinTable({
    name: 'users_sentences'
  })
  sentences: SentenceKo[];
}
