import React from 'react';
import { GameGenre } from '../../types/game';

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenre, onGenreChange }) => {
  const genres: GameGenre[] = [
    'All',
    'RPG',
    'FPS',
    'MOBA',
    'MMO',
    'Battle Royale',
    'Sandbox',
    'Strategy',
    'Sports',
    'Racing'
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <button
          key={genre}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedGenre.toLowerCase() === genre.toLowerCase()
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
          onClick={() => onGenreChange(genre.toLowerCase())}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;