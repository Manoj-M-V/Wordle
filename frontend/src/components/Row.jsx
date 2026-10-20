import React from 'react';
import Tile from './Tile';

export default function Row({ tiles, isShaking, isBouncing, isRevealed }) {
  const className = [
    'row',
    isShaking ? 'row--shake' : '',
    isBouncing ? 'row--bounce' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} role="row">
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          letter={tile.letter}
          status={tile.status}
          position={i}
          isRevealed={isRevealed && tile.status !== null}
        />
      ))}
    </div>
  );
}
