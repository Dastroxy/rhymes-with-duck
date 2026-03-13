import { GameState } from '../types';
import Duck from './Duck';

interface Props {
  game: GameState;
  playerId: string;
  isChuck: boolean;
  onPickWord: (word: string) => void;
}

export default function ChuckPicksWord({ game, playerId, isChuck, onPickWord }: Props) {
  const chuckName = game.players[game.chuckPlayerId]?.name ?? 'Someone';
  const available = game.wordPool
    .filter((w) => !game.usedWords.includes(w))
    .slice(0, 9);

  return (
    <div className="screen">
      <Duck size={90} />
      <p className="phase-label">Chuck's Turn</p>

      <h2 style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.7rem', textAlign: 'center' }}>
        {isChuck
          ? 'You\'re Chuck! Pick a word!'
          : `${chuckName} is Chuck! They're picking a word...`}
      </h2>

      {isChuck ? (
        <>
          <p style={{ fontWeight: 700, color: '#888' }}>Choose the start word:</p>
          <div className="word-grid">
            {available.map((w) => (
              <button key={w} className="word-btn" onClick={() => onPickWord(w)}>
                {w}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="waiting-text">🕐 Waiting for {chuckName} to pick a word...</p>
      )}

      <div className="card" style={{ width: '100%' }}>
        <p style={{ fontWeight: 800, fontFamily: 'Crafty Girls, cursive', fontSize: '1.1rem', marginBottom: '0.6rem' }}>
          🏆 Scoreboard
        </p>
        <div className="player-list">
          {[...game.playerOrder]
            .sort((a, b) => game.players[b].score - game.players[a].score)
            .map((id) => (
              <div key={id} className={`player-row${id === playerId ? ' me' : ''}`}>
                <span className="player-name">
                  {game.players[id].name}
                  {id === game.chuckPlayerId ? ' 🛁' : ''}
                </span>
                <span className="quack-letters">{game.players[id].quackLetters || '—'}</span>
                <span className="score-badge">{game.players[id].score} pts</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
