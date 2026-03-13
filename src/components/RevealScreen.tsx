import { GameState } from '../types';
import Duck from './Duck';

interface Props {
  game: GameState;
  playerId: string;
  isHost: boolean;
  onRevealScores: () => void;
}

export default function RevealScreen({ game, playerId, isHost, onRevealScores }: Props) {
  return (
    <div className="screen">
      <Duck size={90} />
      <p className="phase-label">All Answers Are In!</p>
      <h2 style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.5rem', textAlign: 'center' }}>
        The word was:{' '}
        <span style={{ color: '#f5a623' }}>{game.currentWord}</span>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
        {game.playerOrder.map((id) => {
          const p = game.players[id];
          return (
            <div
              key={id}
              className="answer-card revealed"
              style={id === playerId ? { border: '2px solid #f5a623' } : {}}
            >
              <span className="player-name">
                {p.name}
                {id === playerId ? ' (you)' : ''}
                {id === game.chuckPlayerId ? ' 🛁' : ''}
              </span>
              <span className="answer-word">{p.answer}</span>
            </div>
          );
        })}
      </div>

      {isHost ? (
        <button className="btn btn-primary" onClick={onRevealScores}>
          🏆 Reveal Scores!
        </button>
      ) : (
        <p className="waiting-text">⏳ Waiting for host to reveal scores...</p>
      )}
    </div>
  );
}
