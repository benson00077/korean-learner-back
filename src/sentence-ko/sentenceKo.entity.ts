import { User } from 'src/users/user.entitiy';
import { Column, Entity, Index, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('sentenceKo')
export class SentenceKo {
  @PrimaryColumn()
  @Index({ unique: true })
  timeId: number;

  @Column()
  pos: string;

  @Index({ fulltext: true, parser: 'ngram'})
  @Column()
  sentences: string;

  @ManyToMany(() => User, (user) => user.sentences)
  users: User[];
}
