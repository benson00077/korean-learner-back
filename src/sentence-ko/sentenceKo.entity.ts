import { Shows } from 'src/shows/shows.entity';
import { User } from 'src/users/user.entitiy';
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('sentenceKo')
export class SentenceKo {
  /**
   *  Notice that in db it might actully sotred as string, and js retrive it as stirng as well 
   *  See the bigNumberStrings config on my TypeOrmModule.forRootAsync
   */
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  @Index({ unique: true })
  timeId: number;

  @Column('simple-json')
  pos: string;

  @Index({ fulltext: true, parser: 'ngram' })
  @Column('simple-json')
  subtitles: string[];

  @Index({ fulltext: true, parser: 'ngram' })
  @Column('simple-json')
  subtitlesZh: string[]

  @ManyToMany(() => User, (user) => user.subtitles)
  users: User[];

  @ManyToOne(() => Shows, (show) => show.subtitles, {
    cascade: ['insert', 'update']
  })
  // @JoinColumn({ name: 'showId'})
  show: Shows;

  // // ref: https://stackoverflow.com/a/61433772/16124226
  // @Column()
  // showId: number;
}
