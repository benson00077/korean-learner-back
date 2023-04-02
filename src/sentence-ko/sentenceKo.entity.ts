import { User } from 'src/users/user.entitiy';
import { Column, Entity, Index, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('sentenceKo')
export class SentenceKo {
  @PrimaryColumn()
  @Index({ unique: true })
  timeId: number;

  @Column()
  pos: string;

  @Index({ fulltext: true, parser: 'ngram' })
  @Column('simple-json')
  subtitles: string[];

  @ManyToMany(() => User, (user) => user.subtitles)
  users: User[];
}
