import { GameState } from '../types';
import Duck from './Duck';

interface Props {
  game: GameState;
  playerId: string;
}

export default function GameOverScreen({ game, playerId }: Props) {
  const eligible = game.playerOrder.filter(
    (id) => game.players[id].quackLetters !== 'QUACK'
  );
  const sorted = [...eligible].sort(
    (a, b) => game.players[b].score - game.players[a].score
  );
  const winnerId = sorted[0];
  const winner = winnerId ? game.players[winnerId] : null;
  const isWinner = winnerId === playerId;

  return (
    <div className="screen">
      <Duck size={120} className="duck-img-lg" />

      {winner ? (
        <>
          <div className="winner-banner">
            {isWinner ? '🎉 YOU WIN! 🎉' : `${winner.name} Wins! 🎉`}
          </div>
          <p style={{ color: '#aaa', fontWeight: 700, fontSize: '1.1rem' }}>
            with {winner.score} points
          </p>
        </>
      ) : (
        <div className="winner-banner">Everyone quacked out!</div>
      )}

      <div className="card" style={{ width: '100%' }}>
        <p style={{ fontWeight: 800, fontFamily: 'Crafty Girls, cursive', fontSize: '1.2rem', marginBottom: '0.7rem' }}>
          Final Standings
        </p>
        <div className="player-list">
          {[...game.playerOrder]
            .sort((a, b) => game.players[b].score - game.players[a].score)
            .map((id, rank) => {
              const p = game.players[id];
              const quacked = p.quackLetters === 'QUACK';
              return (
                <div
                  key={id}
                  className={`player-row${id === playerId ? ' me' : ''}`}
                  style={quacked ? { opacity: 0.45 } : {}}
                >
                  <span style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.1rem', color: rank === 0 && !quacked ? '#f5a623' : '#ccc' }}>
                    #{rank + 1}
                  </span>
                  <span className="player-name">
                    {p.name}{id === playerId ? ' (you)' : ''}
                  </span>
                  <span className="quack-letters">{p.quackLetters || '—'}</span>
                  <span className="score-badge">{p.score} pts</span>
                </div>
              );
            })}
        </div>
      </div>

      <p style={{ color: '#bbb', fontWeight: 700, fontSize: '0.9rem' }}>
        🔄 Refresh the page to play again!
      </p>
    </div>
  );
}
