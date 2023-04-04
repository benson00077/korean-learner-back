import { User } from 'src/users/user.entitiy';
import { Column, Entity, Index, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('sentenceKo')
export class SentenceKo {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  @Index({ unique: true })
  timeId: number;

  @Column('simple-json')
  pos: string;

  @Index({ fulltext: true, parser: 'ngram' })
  @Column('simple-json')
  subtitles: string[];

  @Column('simple-json')
  subtitlesZh: string[]

  @ManyToMany(() => User, (user) => user.subtitles)
  users: User[];
}
