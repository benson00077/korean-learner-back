import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('sentenceKo')
export class SentenceKo {
  @PrimaryColumn()
  @Index({ unique: true })
  timeId: number;

  @Column()
  pos: string;

  @Column()
  sentences: string;
}