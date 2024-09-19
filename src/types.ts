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

export type GameConfig = {
  mapData: MapConfig;
};
