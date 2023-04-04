interface subTitlesEntity {
  startTime: string;
  subtitles: string[];
  subtitlesZh: string[];
  pos: string[][][];
}

export class SourceJsonDto {
  show: string;
  /**
   *  episodes[i][j]:
   *    i+1 for episode,
   *    j   for each subTitlesEntity's chunckId in the episode
   */
  episodes: subTitlesEntity[][];
}
