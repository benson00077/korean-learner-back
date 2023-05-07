import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { User } from 'src/users/user.entitiy';
import { Column, Entity, In, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shows')
export class Shows {
  @PrimaryGeneratedColumn()
  @Index({ unique: true })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SentenceKo, (sentenceKo) => sentenceKo.show)
  subtitles: SentenceKo[];

  @ManyToMany(() => User, (user) => user.shows) 
  users: User[];
}
