import React, { useState } from 'react';
import { UserProgressState } from '../../types';
import { ALL_ACHIEVEMENTS, calculateLevelFromXP, DEMO_LEADERBOARD_USERS } from '../../utils/gamification';
import { getRankTitle } from '../../utils/storage';
import {
  Trophy,
  Award,
  Zap,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Crown,
  User,
  Users,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamificationHubProps {
  userProgress: UserProgressState;
  onUpdateAvatar: (avatar: string) => void;
  onUpdateUserName: (name: string) => void;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  userProgress,
  onUpdateAvatar,
  onUpdateUserName,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'learning' | 'accuracy' | 'streak' | 'tools' | 'social'>('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userProgress.userName || 'Studente Matematico');

  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevelFromXP(userProgress.xp);
  const rank = getRankTitle(userProgress.totalCorrectAnswers / 2 + level * 2);

  const unlockedSet = new Set(userProgress.unlockedBadges || []);

  const avatarsList = ['👨‍🎓', '👩‍🔬', '🧑‍💻', '👨‍🚀', '🧙‍♂️', '🦸‍♀️', '🦁', '🦉', '🎓', '⚛️'];

  const filteredBadges = ALL_ACHIEVEMENTS.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateUserName(tempName.trim());
      setIsEditingProfile(false);
    }
  };

  const celebrateBadge = (title: string) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Build current weekly leaderboard incorporating user
  const userLeaderboardEntry = {
    id: 'user_current',
    name: `${userProgress.userName} (Tu)`,
    avatar: userProgress.equippedAvatar,
    xpThisWeek: Math.min(600, userProgress.xp),
    stars: userProgress.attempts.reduce((acc, a) => acc + a.starsEarned, 0),
    streak: userProgress.dailyStreak.streakCount,
    league: 'Lega Pitagora (Oro)',
  };

  const allLeaderboard = [...DEMO_LEADERBOARD_USERS, userLeaderboardEntry].sort(
    (a, b) => b.xpThisWeek - a.xpThisWeek
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Hub Gamification & Trofei Accademici</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Livello {level} • {userProgress.userName}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Guadagna XP risolvendo esercizi, mantieni attiva la tua serie giornaliera e sblocca badge esclusivi per scalare le classifiche della Lega Matematica!
          </p>
        </div>

        {/* Level XP Progress Box */}
        <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl shrink-0 shadow-inner space-y-3 min-w-[280px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Avanzamento Livello</span>
            <span className="text-amber-400 font-extrabold font-mono">{userProgress.xp} XP Totali</span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>{currentLevelXp} / {nextLevelXp} XP</span>
              <span>{progressPercent}% al Livello {level + 1}</span>
            </div>
          </div>

          {/* Profile Edit Avatar Bar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl bg-slate-800 p-1 rounded-xl border border-slate-700">{userProgress.equippedAvatar}</span>
              <div>
                <span className="text-xs font-bold text-slate-200 block">{userProgress.userName}</span>
                <span className="text-[10px] text-amber-400">{rank.title}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              {isEditingProfile ? 'Chiudi' : 'Personalizza'}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar & Profile Editor Drawer */}
      {isEditingProfile && (
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-4 h-4 text-amber-600" />
            <span>Personalizza Profilo & Avatar</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome Studente</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold w-full focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                >
                  Salva
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scegli il tuo Avatar Matematico</label>
              <div className="flex flex-wrap gap-2">
                {avatarsList.map((av) => (
                  <button
                    key={av}
                    onClick={() => onUpdateAvatar(av)}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      userProgress.equippedAvatar === av
                        ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Badges Gallery - Right Weekly Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Achievements Gallery */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Galleria Trofei & Badge ({unlockedSet.size} / {ALL_ACHIEVEMENTS.length})
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Tutti' },
                { id: 'learning', label: 'Apprendimento' },
                { id: 'accuracy', label: 'Accuratezza' },
                { id: 'streak', label: 'Serie' },
                { id: 'tools', label: 'Strumenti' },
                { id: 'social', label: 'Social' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBadges.map((badge) => {
              const isUnlocked = unlockedSet.has(badge.id);

              return (
                <div
                  key={badge.id}
                  onClick={() => isUnlocked && celebrateBadge(badge.title)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start space-x-3.5 relative overflow-hidden cursor-pointer ${
                    isUnlocked
                      ? 'bg-white border-amber-300 shadow-xs hover:border-amber-400 hover:shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                      isUnlocked ? 'bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300' : 'bg-slate-200 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <div className="space-y-1 pr-6 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                        {badge.title}
                      </h4>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {badge.description}
                    </p>
                    <div className="inline-flex items-center space-x-1 pt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>+{badge.xpReward} XP</span>
                    </div>
                  </div>

                  {!isUnlocked && (
                    <div className="absolute top-3 right-3 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Col: Weekly Leaderboard */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3>Classifica Settimanale</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Lega Pitagora 🏆
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              I primi 5 studenti promossi alla Lega Superiore ogni Lunedì. Accumula XP eseguendo quiz e sfide!
            </p>

            {/* Rankings List */}
            <div className="space-y-2">
              {allLeaderboard.map((user, idx) => {
                const isCurrentUser = user.id === 'user_current';
                let rankBadge = `${idx + 1}°`;
                let rankColor = 'bg-slate-100 text-slate-700';

                if (idx === 0) {
                  rankBadge = '🥇';
                  rankColor = 'bg-amber-100 text-amber-800 border-amber-300';
                } else if (idx === 1) {
                  rankBadge = '🥈';
                  rankColor = 'bg-slate-200 text-slate-800 border-slate-300';
                } else if (idx === 2) {
                  rankBadge = '🥉';
                  rankColor = 'bg-amber-900/10 text-amber-900 border-amber-800/30';
                }

                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs gap-2 ${
                      isCurrentUser
                        ? 'bg-amber-50/80 border-amber-400 shadow-xs ring-2 ring-amber-400/20 font-bold'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${rankColor}`}>
                        {rankBadge}
                      </span>
                      <span className="text-base">{user.avatar}</span>
                      <div className="truncate">
                        <span className="font-extrabold text-slate-900 block truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                          <span>{user.streak}d 🔥</span>
                          <span>•</span>
                          <span>{user.stars} ★</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-amber-600 text-sm block">
                        {user.xpThisWeek} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
