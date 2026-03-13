import { GameState } from '../types';
import Duck from './Duck';

interface Props {
  game: GameState;
  playerId: string;
  isHost: boolean;
  onNextRound: () => void;
}

export default function ScoringScreen({ game, playerId, isHost, onNextRound }: Props) {
  return (
    <div className="screen">
      <Duck size={90} />
      <p className="phase-label">Round Results</p>
      <h2 style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.8rem' }}>
        How'd everyone do? 🤔
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        {game.roundResults.map((r) => {
          const p = game.players[r.playerId];
          const isMe = r.playerId === playerId;
          return (
            <div
              key={r.playerId}
              className="result-row"
              style={isMe ? { border: '2px solid #f5a623', background: '#fff8e1' } : {}}
            >
              <span className="player-name">
                {p.name}{isMe ? ' (you)' : ''}
                {r.playerId === game.chuckPlayerId ? ' 🛁' : ''}
              </span>
              <span style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.1rem', color: '#aaa' }}>
                {r.answer}
              </span>
              {r.gotQuackLetter ? (
                <span className="shame-badge">+"{p.quackLetters.slice(-1)}" 😬</span>
              ) : (
                <span className="points-gained">+{r.pointsEarned} pts</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ width: '100%' }}>
        <p style={{ fontWeight: 800, fontFamily: 'Crafty Girls, cursive', fontSize: '1.1rem', marginBottom: '0.6rem' }}>
          🏆 Leaderboard
        </p>
        <div className="player-list">
          {[...game.playerOrder]
            .sort((a, b) => game.players[b].score - game.players[a].score)
            .map((id, rank) => (
              <div key={id} className={`player-row${id === playerId ? ' me' : ''}`}>
                <span style={{ fontFamily: 'Crafty Girls, cursive', color: rank === 0 ? '#f5a623' : '#ccc', fontSize: '1.1rem' }}>
                  #{rank + 1}
                </span>
                <span className="player-name">{game.players[id].name}</span>
                <span className="quack-letters">{game.players[id].quackLetters || '—'}</span>
                <span className="score-badge">{game.players[id].score} pts</span>
              </div>
            ))}
        </div>
        <p style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#bbb', textAlign: 'center', fontWeight: 700 }}>
          First to 20 pts wins 🏆 | Spell Q-U-A-C-K and you're out!
        </p>
      </div>

      {isHost ? (
        <button className="btn btn-primary" onClick={onNextRound}>Next Round!</button>
      ) : (
        <p className="waiting-text">⏳ Waiting for host to start next round...</p>
      )}
    </div>
  );
}
