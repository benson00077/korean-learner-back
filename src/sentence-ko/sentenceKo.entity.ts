import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

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
}
