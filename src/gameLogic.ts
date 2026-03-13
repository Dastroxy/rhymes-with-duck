import { Player, RoundResult } from './types';

export function computeRoundResults(
  players: Record<string, Player>,
  playerOrder: string[],
  chuckPlayerId: string
): RoundResult[] {
  const results: RoundResult[] = [];
  const answers = playerOrder.map((id) => players[id].answer.trim().toUpperCase());

  const counts: Record<string, number> = {};
  answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });

  const chuckAnswer = players[chuckPlayerId].answer.trim().toUpperCase();

  playerOrder.forEach((id, idx) => {
    const myAnswer = answers[idx];
    const matchCount = counts[myAnswer] - 1; // others who match me

    let points = 0;
    let gotQuackLetter = false;

    if (matchCount === 0) {
      gotQuackLetter = true;
    } else if (matchCount === 1) {
      points = 3;
    } else {
      points = 1;
    }

    // +2 bonus for matching Chuck (non-Chuck players only)
    if (id !== chuckPlayerId && myAnswer === chuckAnswer && matchCount > 0) {
      points += 2;
    }

    // Chuck gets +1 per player they match with
    if (id === chuckPlayerId && matchCount > 0) {
      points += matchCount;
    }

    results.push({ playerId: id, answer: myAnswer, pointsEarned: points, gotQuackLetter });
  });

  return results;
}

export const QUACK = 'QUACK';

export function appendQuackLetter(current: string): string {
  return current + QUACK[current.length];
}
