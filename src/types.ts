export type PlatformConfig = {
  x: number;
  y: number;
  scale: number;
  key: string;
};

export type MapConfig = {
  id: string;
  config: PlatformConfig[];
};
export type PlayerData = {
  player1Name: string;
  player2Name: string;
};

export type GameConfig = {
  mapData: MapConfig;
  playerData: PlayerData;
};
