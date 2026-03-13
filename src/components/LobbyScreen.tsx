import { GameState } from '../types';
import Duck from './Duck';

interface Props {
  game: GameState;
  playerId: string;
  roomId: string;
  isHost: boolean;
  onStart: () => void;
}

export default function LobbyScreen({ game, playerId, roomId, isHost, onStart }: Props) {
  const playerCount = game.playerOrder.length;
  const canStart = playerCount >= 2;

  return (
    <div className="screen">
      <Duck size={90} />
      <h1 className="game-title">Rhymes With Duck</h1>
      <p className="phase-label">Waiting Room</p>

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Share this Room Code 📋</p>
        <div className="room-code">{roomId}</div>
        <p style={{ marginTop: '0.5rem', color: '#aaa', fontSize: '0.85rem' }}>
          Open new tabs and join with this code to test!
        </p>
      </div>

      <div style={{ width: '100%' }}>
        <h2 style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.3rem', marginBottom: '0.6rem' }}>
          Players ({playerCount}) 🐣
        </h2>
        <div className="player-list">
          {game.playerOrder.map((id) => (
            <div key={id} className={`player-row${id === playerId ? ' me' : ''}`}>
              <span className="player-name">
                {game.players[id].name}
                {id === playerId ? ' (you)' : ''}
              </span>
              {id === game.hostId && (
                <span style={{ fontSize: '0.8rem', color: '#f5a623', fontWeight: 800 }}>👑 HOST</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {isHost ? (
        <button className="btn btn-primary" disabled={!canStart} onClick={onStart}>
          {canStart ? `🎉 Start Game (${playerCount} players)` : '⏳ Need at least 2 players...'}
        </button>
      ) : (
        <p className="waiting-text">⏳ Waiting for host to start the game...</p>
      )}
    </div>
  );
}
