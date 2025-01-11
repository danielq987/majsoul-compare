
export enum Mode {
  GOLD_EAST = 8,
  GOLD_HANCHAN = 9,
  JADE_EAST = 11,
  JADE_HANCHAN = 12,
  THRONE_EAST = 15,
  THRONE_HANCHAN = 16
}

export enum Rank {
  EXPERT,
  MASTER,
  SAINT,
  CELESTIAL
}

export type PlayerRank = {
  rank: Rank;
  subrank: number;
} | number;

type PlayerMatchDetail = {
  accountId: number;
  nickname: string;
  level: PlayerRank;
  score: number;
  gradingScore: number;
}

export type PlayerSearchInstance = {
  id: number;
  nickname: string;
  level: {
    id: number;
    score: number;
    delta: number;
  };
  latest_timestamp: number;
}

export type PlayerMatchRecord = {
  _id: string;
  modeId: Mode;
  uuid: string;
  startTime: number;
  endTime: number;
  players: PlayerMatchDetail[];
}

export type PlayerExtendedStats = {
  [key: string]: number;
};