import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FavoritesHover from './FavoritesHover';

const FavoritesButton = ({ favoritesCount, mounted }) => {
  const [showHover, setShowHover] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    setShowHover(false);
    router.push('/favoritos');
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <button
        onClick={handleNavigate}
        className="relative text-gray-300 hover:text-pink-400 transition-colors duration-300"
        aria-label={`Favoritos (${favoritesCount} productos)`}
      >
        <Heart size={20} />
        {mounted && favoritesCount > 0 && (
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs flex items-center justify-center font-bold"
            style={{ boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}
            aria-hidden="true"
          >
            {favoritesCount > 9 ? '9+' : favoritesCount}
          </span>
        )}
      </button>

      {/* Hover preview */}
      {showHover && (
        <div
          className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            boxShadow: '0 20px 60px rgba(147, 51, 234, 0.4)',
          }}
        >
          <FavoritesHover 
            onClose={() => setShowHover(false)}
            onNavigate={handleNavigate}
          />
        </div>
      )}
    </div>
  );
};

export default FavoritesButton;