import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import LobbyScreen from './components/LobbyScreen';
import ChuckPicksWord from './components/ChuckPicksWord';
import WritingScreen from './components/WritingScreen';
import RevealScreen from './components/RevealScreen';
import ScoringScreen from './components/ScoringScreen';
import GameOverScreen from './components/GameOverScreen';
import Duck from './components/Duck';
import './App.css';

function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

function getOrCreatePlayerId() {
  let id = sessionStorage.getItem('quack_player_id');
  if (!id) {
    id = generateId();
    sessionStorage.setItem('quack_player_id', id);
  }
  return id;
}

export default function App() {
  const [roomId, setRoomId] = useState('');
  const [playerId] = useState(getOrCreatePlayerId);
  const [joined, setJoined] = useState(false);
  const [inputRoom, setInputRoom] = useState('');
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    game, createRoom, joinRoom, startGame,
    pickWord, submitAnswer, advanceToReveal,
    revealScores, nextRound,
  } = useGame(roomId, playerId);

  useEffect(() => {
    if (game?.phase === 'writing') advanceToReveal();
  }, [game, advanceToReveal]);

  const handleCreate = async () => {
    if (!inputName.trim()) return setError('Enter your name!');
    setLoading(true);
    setError('');
    const id = generateId(6);
    setRoomId(id);
    try {
      await createRoom(inputName.trim(), id);
      setJoined(true);
    } catch (e) {
      setError('Failed to create room. Check Firebase config!');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!inputName.trim()) return setError('Enter your name!');
    if (!inputRoom.trim()) return setError('Enter a room code!');
    setLoading(true);
    setError('');
    const rid = inputRoom.trim().toUpperCase();
    setRoomId(rid);
    try {
      const ok = await joinRoom(inputName.trim(), rid);
      if (!ok) {
        setError('Room not found! Double-check the code 👀');
        setLoading(false);
        return;
      }
      setJoined(true);
    } catch (e) {
      setError('Failed to join room. Try again!');
    }
    setLoading(false);
  };

  if (!joined) {
    return (
      <div className="home-screen">
        <Duck size={110} />
        <h1 className="game-title">Rhymes With Duck</h1>
        <p className="subtitle">The quacky rhyming party game!</p>
        <input
          className="input"
          placeholder="Your name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          disabled={loading}
        />
        <div className="home-buttons">
          <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : '🎲 Create Room'}
          </button>
          <div className="or-divider">— or join one —</div>
          <input
            className="input"
            placeholder="Room code"
            value={inputRoom}
            onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            disabled={loading}
          />
          <button className="btn btn-secondary" onClick={handleJoin} disabled={loading}>
            {loading ? 'Joining...' : '🚪 Join Room'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        <p className="tip">💡 Open multiple tabs to test solo!</p>
      </div>
    );
  }

  if (!game) return <div className="loading"><Duck size={50} /> Loading quackiness...</div>;

  const isChuck = game.chuckPlayerId === playerId;
  const isHost = game.hostId === playerId;
  const me = game.players[playerId];

  if (!me) return <div className="loading"><Duck size={50} /> Joining room...</div>;

  switch (game.phase) {
    case 'lobby':
      return <LobbyScreen game={game} playerId={playerId} roomId={roomId} isHost={isHost} onStart={startGame} />;
    case 'chuck_picks_word':
      return <ChuckPicksWord game={game} playerId={playerId} isChuck={isChuck} onPickWord={pickWord} />;
    case 'writing':
      return <WritingScreen game={game} playerId={playerId} me={me} onSubmit={submitAnswer} />;
    case 'revealing':
      return <RevealScreen game={game} playerId={playerId} isHost={isHost} onRevealScores={revealScores} />;
    case 'scoring':
      return <ScoringScreen game={game} playerId={playerId} isHost={isHost} onNextRound={nextRound} />;
    case 'game_over':
      return <GameOverScreen game={game} playerId={playerId} />;
    default:
      return <div className="loading"><Duck size={50} /> Quacking...</div>;
  }
}
