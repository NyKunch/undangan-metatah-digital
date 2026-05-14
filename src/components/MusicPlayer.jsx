import { Music, Play } from 'lucide-react';
import React from 'react'


const MusicPlayer = ({ isPlaying, setIsPlaying, audioRef, isOpened }) => {

  // Fungsi untuk toggle Play/Pause
  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Elemen Audio Hidden */}
      <audio 
        ref={audioRef} 
        src="/song.mp3" // Ganti dengan path musik kamu
        loop 
      />

      {/* Tombol Musik Melayang (Floating Button) */}
      {isOpened && (
        <button
        onClick={toggleMusic}
        className="fixed bottom-24 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-all"
        aria-label="Control Music"
      >
        <div className={`${isPlaying ? 'animate-spin-slow' : ''}`}>
          {isPlaying ? <Music size={24} /> : <Play size={24} />}
        </div>
        
        {/* Indikator Status Visual Kecil */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
        </span>
      </button>
      )}

      {/* Custom Animation untuk CD Berputar */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 5s linear infinite;
        }
      `}} />
    </>
  );
};

export default MusicPlayer