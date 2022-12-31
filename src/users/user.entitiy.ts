import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: string;

  @ManyToMany(() => SentenceKo, (sentenceKo) => sentenceKo.users, {
    cascade: true
  })
  @JoinTable({
    name: 'users_sentences'
  })
  subtitles: SentenceKo[];
}
