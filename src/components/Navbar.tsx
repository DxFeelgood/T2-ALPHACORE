import React from 'react';
import { Sparkles, Star, Flame, Download, GraduationCap, RefreshCw } from 'lucide-react';
import { UserProgressState } from '../types';
import { getRankTitle } from '../utils/storage';
import { calculateLevelFromXP } from '../utils/gamification';
import { ThemeToggle } from './Common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  userProgress: UserProgressState;
  onOpenReportModal: () => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProgress,
  onOpenReportModal,
  onResetProgress,
}) => {
  let totalStars = 0;
  let completedModulesCount = 0;

  Object.values(userProgress.modules).forEach((mod) => {
    totalStars += mod.stars;
    if (mod.stars >= 2) completedModulesCount++;
  });

  const overallPercent = Math.round((completedModulesCount / 7) * 100);
  const rank = getRankTitle(totalStars);
  const streak = userProgress.dailyStreak.streakCount;
  const { level } = calculateLevelFromXP(userProgress.xp || 120);

  const { theme } = useTheme();

  return (
    <header className={`sticky top-0 z-30 border-b shadow-lg no-print transition-colors duration-300 ${
      theme === 'space'
        ? 'bg-[#0a0e21] text-slate-100 border-indigo-900/60 shadow-indigo-950/50'
        : 'bg-[#1c1917] text-amber-50 border-stone-800 shadow-md'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand & Rank */}
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Mathero
                </h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm ${rank.badgeColor}`}>
                  {rank.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Piattaforma Interattiva per lo Studio dell'Analisi Matematica
              </p>
            </div>
          </div>

          {/* Top Summary Bar Metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
            
            {/* User Level & XP */}
            <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
              <span className="text-base">{userProgress.equippedAvatar || '👨‍🎓'}</span>
              <div>
                <span className="text-amber-300 block text-[10px] uppercase font-bold tracking-wider">Livello {level}</span>
                <span className="font-bold text-amber-400">{userProgress.xp || 120} XP</span>
              </div>
            </div>

            {/* Global Progress % */}
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Avanzamento</span>
                <span className="font-bold text-white">{overallPercent}%</span>
              </div>
            </div>

            {/* Total Stars */}
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Stelle</span>
                <span className="font-bold text-amber-300">{totalStars} / 21 ⭐</span>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Serie</span>
                <span className="font-bold text-rose-400">{streak} Giorni</span>
              </div>
            </div>

            {/* Theme Toggle Component */}
            <ThemeToggle />

            {/* Export PDF Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-sm text-xs cursor-pointer"
              title="Esporta Report PDF o Scheda di Studio"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Esporta PDF</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetProgress}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Ripristina Percorso e Progressi"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

