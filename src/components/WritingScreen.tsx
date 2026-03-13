import { useState } from 'react';
import { GameState, Player } from '../types';
import Duck from './Duck';

interface Props {
  game: GameState;
  playerId: string;
  me: Player;
  onSubmit: (answer: string) => void;
}

export default function WritingScreen({ game, playerId, me, onSubmit }: Props) {
  const [answer, setAnswer] = useState('');
  const submitted = me.isReady;
  const readyCount = game.playerOrder.filter((id) => game.players[id].isReady).length;
  const totalCount = game.playerOrder.length;

  return (
    <div className="screen">
      <p className="phase-label">Write Your Rhyme</p>
      <h2 style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '1.4rem', textAlign: 'center' }}>
        Find a word that rhymes with...
      </h2>

      <div className="big-word">{game.currentWord}</div>

      {!submitted ? (
        <>
          <input
            className="input"
            placeholder="Your rhyming word..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && answer.trim()) onSubmit(answer.trim());
            }}
            autoFocus
            style={{ maxWidth: '100%', fontSize: '1.2rem', textAlign: 'center' }}
          />
          <button
            className="btn btn-primary"
            onClick={() => answer.trim() && onSubmit(answer.trim())}
            disabled={!answer.trim()}
          >
            🔒 Lock It In!
          </button>
          <p style={{ color: '#bbb', fontSize: '0.85rem', fontWeight: 600 }}>
            Same number of syllables, matches on sound!
          </p>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: '#aaa', fontWeight: 700, marginBottom: '0.4rem' }}>
            Your answer:
          </p>
          <p style={{ fontFamily: 'Crafty Girls, cursive', fontSize: '2.5rem', color: '#f5a623' }}>
            {me.answer}
          </p>
          <p className="waiting-text" style={{ marginTop: '0.5rem' }}>
            {readyCount === totalCount
              ? '🎉 Everyone answered!'
              : `⏳ Waiting... (${readyCount}/${totalCount} ready)`}
          </p>
        </div>
      )}

      <div className="player-list" style={{ width: '100%' }}>
        {game.playerOrder.map((id) => (
          <div key={id} className={`player-row${id === playerId ? ' me' : ''}`}>
            <span className="player-name">{game.players[id].name}</span>
            <span style={{ fontWeight: 800, color: game.players[id].isReady ? '#4ecdc4' : '#ddd' }}>
              {game.players[id].isReady ? '✅ Locked in!' : '✍️ Still writing...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
