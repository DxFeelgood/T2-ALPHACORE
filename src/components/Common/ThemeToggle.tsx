import React from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = true,
}) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'space';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
        isDark
          ? 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50 shadow-sm shadow-cyan-500/20'
          : 'bg-amber-100/90 text-amber-900 border-amber-300/80 hover:bg-amber-200/90 shadow-xs'
      } ${className}`}
      title={isDark ? 'Passa a "Classic Academic" (Tema Chiaro)' : 'Passa a "Deep Space" (Tema Scuro)'}
      aria-label="Cambia tema dell'applicazione"
    >
      {isDark ? (
        <>
          <Moon className="w-4 h-4 text-cyan-300 fill-cyan-300/20 shrink-0" />
          {showLabel && <span className="truncate">Deep Space</span>}
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
          {showLabel && <span className="truncate">Classic Academic</span>}
        </>
      )}
    </button>
  );
};
