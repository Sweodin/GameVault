export interface Game {
  id: string;
  name: string;
  image: string;
  genre: string;
  activeServers: number;
  onlinePlayers: number;
  trending: boolean;
  popularChannels: string[];
}

export interface GameCardProps {
  game: Game;
}

export type GameGenre =
  | "All"
  | "RPG"
  | "FPS"
  | "MOBA"
  | "MMO"
  | "Battle Royale"
  | "Sandbox"
  | "Strategy"
  | "Sports"
  | "Racing"
  | string;
