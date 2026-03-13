export type GamePhase =
  | 'lobby'
  | 'chuck_picks_word'
  | 'writing'
  | 'revealing'
  | 'scoring'
  | 'game_over';

export interface Player {
  id: string;
  name: string;
  score: number;
  quackLetters: string; // e.g. "QUA"
  answer: string;
  revealed: boolean;
  isReady: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Record<string, Player>;
  playerOrder: string[];
  chuckPlayerId: string;
  currentWord: string;
  revealIndex: number;
  roundResults: RoundResult[];
  hostId: string;
  wordPool: string[];
  usedWords: string[];
}

export interface RoundResult {
  playerId: string;
  answer: string;
  pointsEarned: number;
  gotQuackLetter: boolean;
}
