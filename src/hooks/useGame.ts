import { useEffect, useState, useCallback } from 'react';
import {
  doc, onSnapshot, setDoc, updateDoc, getDoc, arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase';
import { GameState, Player } from '../types';
import { computeRoundResults, appendQuackLetter } from '../gameLogic';
import { WORD_POOL } from '../wordPool';

export function useGame(roomId: string, playerId: string) {
  const [game, setGame] = useState<GameState | null>(null);

  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      if (snap.exists()) setGame(snap.data() as GameState);
    });
    return unsub;
  }, [roomId]);

  const createRoom = useCallback(async (playerName: string, rid: string) => {
    const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
    const player: Player = {
      id: playerId, name: playerName, score: 0,
      quackLetters: '', answer: '', revealed: false, isReady: false,
    };
    const state: GameState = {
      phase: 'lobby',
      players: { [playerId]: player },
      playerOrder: [playerId],
      chuckPlayerId: playerId,
      currentWord: '',
      revealIndex: 0,
      roundResults: [],
      hostId: playerId,
      wordPool: shuffled,
      usedWords: [],
    };
    await setDoc(doc(db, 'rooms', rid), state);
  }, [playerId]);

  const joinRoom = useCallback(async (playerName: string, rid: string) => {
    const ref = doc(db, 'rooms', rid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    const state = snap.data() as GameState;
    if (state.players[playerId]) return true;
    const player: Player = {
      id: playerId, name: playerName, score: 0,
      quackLetters: '', answer: '', revealed: false, isReady: false,
    };
    await updateDoc(ref, {
      [`players.${playerId}`]: player,
      playerOrder: arrayUnion(playerId),
    });
    return true;
  }, [playerId]);

  const startGame = useCallback(async () => {
    if (!roomId) return;
    await updateDoc(doc(db, 'rooms', roomId), { phase: 'chuck_picks_word' });
  }, [roomId]);

  const pickWord = useCallback(async (word: string) => {
    if (!game || !roomId) return;
    const updates: Record<string, unknown> = {
      currentWord: word,
      phase: 'writing',
      revealIndex: 0,
      usedWords: arrayUnion(word),
    };
    game.playerOrder.forEach((id) => {
      updates[`players.${id}.answer`] = '';
      updates[`players.${id}.revealed`] = false;
      updates[`players.${id}.isReady`] = false;
    });
    await updateDoc(doc(db, 'rooms', roomId), updates);
  }, [roomId, game]);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!roomId) return;
    await updateDoc(doc(db, 'rooms', roomId), {
      [`players.${playerId}.answer`]: answer,
      [`players.${playerId}.isReady`]: true,
    });
  }, [roomId, playerId]);

  const advanceToReveal = useCallback(async () => {
    if (!game || !roomId || game.hostId !== playerId) return;
    const allReady = game.playerOrder.every((id) => game.players[id].isReady);
    if (allReady && game.phase === 'writing') {
      const updates: Record<string, unknown> = { phase: 'revealing' };
      game.playerOrder.forEach((id) => {
        updates[`players.${id}.revealed`] = true;
      });
      await updateDoc(doc(db, 'rooms', roomId), updates);
    }
  }, [game, roomId, playerId]);

  const revealScores = useCallback(async () => {
    if (!game || !roomId) return;
    const results = computeRoundResults(game.players, game.playerOrder, game.chuckPlayerId);
    const scoreUpdates: Record<string, unknown> = { phase: 'scoring', roundResults: results };
    results.forEach(({ playerId: pid, pointsEarned, gotQuackLetter }) => {
      const p = game.players[pid];
      scoreUpdates[`players.${pid}.score`] = p.score + pointsEarned;
      if (gotQuackLetter) {
        scoreUpdates[`players.${pid}.quackLetters`] = appendQuackLetter(p.quackLetters);
      }
    });
    await updateDoc(doc(db, 'rooms', roomId), scoreUpdates);
  }, [game, roomId]);

  const nextRound = useCallback(async () => {
    if (!game || !roomId) return;

    const winners = game.playerOrder.filter((id) => game.players[id].score >= 20);
    const activePlayers = game.playerOrder.filter((id) => game.players[id].quackLetters !== 'QUACK');

    // End game if someone hit 20 pts, or only 1 (or 0) active players remain
    if (winners.length > 0 || activePlayers.length <= 1) {
      await updateDoc(doc(db, 'rooms', roomId), { phase: 'game_over' });
      return;
    }

    // Pass Chuck to the next *active* (non-quacked) player
    const currentChuckIdx = game.playerOrder.indexOf(game.chuckPlayerId);
    let nextChuck = game.chuckPlayerId;
    let i = 1;
    while (i <= game.playerOrder.length) {
      const candidate = game.playerOrder[(currentChuckIdx + i) % game.playerOrder.length];
      if (game.players[candidate].quackLetters !== 'QUACK') {
        nextChuck = candidate;
        break;
      }
      i++;
    }

    await updateDoc(doc(db, 'rooms', roomId), {
      chuckPlayerId: nextChuck,
      phase: 'chuck_picks_word',
      roundResults: [],
    });
  }, [game, roomId]);

  return {
    game, createRoom, joinRoom, startGame,
    pickWord, submitAnswer, advanceToReveal,
    revealScores, nextRound,
  };
}
