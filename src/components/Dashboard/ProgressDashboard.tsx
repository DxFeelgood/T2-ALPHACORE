import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProgressState } from '../../types';
import { MODULES_DATA } from '../../data/modulesData';
import { getRankTitle } from '../../utils/storage';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart3,
  Award,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  History,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';

interface ProgressDashboardProps {
  userProgress: UserProgressState;
  onResetProgress: () => void;
  onOpenReportModal: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userProgress,
  onResetProgress,
  onOpenReportModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'space';

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  let totalStars = 0;
  let completedModulesCount = 0;

  Object.values(userProgress.modules).forEach((mod) => {
    totalStars += mod.stars;
    if (mod.stars >= 2) completedModulesCount++;
  });

  const overallPercent = Math.round((completedModulesCount / 7) * 100);
  const rank = getRankTitle(totalStars);
  const accuracy = userProgress.totalQuestionsAnswered > 0
    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Intro Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Progressi e Statistiche Personali</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Panoramica del Rendimento Accademico
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Monitora la percentuale di completamento del percorso, il livello di competenza per ciascun argomento, la precisione dei quiz e lo storico dei tentativi effettuati.
        </p>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Overall Completion */}
        <div className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avanzamento Globale</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className={`text-3xl font-extrabold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>{overallPercent}%</div>
          <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <motion.div
              className="bg-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{completedModulesCount} di 7 Moduli completati</span>
        </div>

        {/* Metric 2: Total Stars */}
        <div className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stelle Guadagnate</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-500">{totalStars} / 21 ⭐</div>
          <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{rank.title}</span>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Valutazione esercizi svolti</span>
        </div>

        {/* Metric 3: Quiz Accuracy */}
        <div className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accuratezza Quiz</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-500">{accuracy}%</div>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {userProgress.totalCorrectAnswers} corrette su {userProgress.totalQuestionsAnswered} risposte
          </span>
        </div>

        {/* Metric 4: Total Questions Completed */}
        <div className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Esercizi Svolti</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className={`text-3xl font-extrabold ${isDark ? 'text-purple-400' : 'text-indigo-700'}`}>
            {userProgress.totalQuestionsAnswered}
          </div>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Totale quesiti affrontati</span>
        </div>

      </div>

      {/* Subject Mastery Level Indicators */}
      <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 font-bold text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Layers className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <h3>Indicatori di Competenza per Materia</h3>
          </div>
          <button
            onClick={onOpenReportModal}
            className={`text-xs font-bold underline cursor-pointer ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Scarica Scheda di Studio (PDF)
          </button>
        </div>

        <div className="space-y-4">
          {MODULES_DATA.map((mod, idx) => {
            const modProgress = userProgress.modules[mod.id] || { stars: 0, unlocked: false };
            const starPercent = Math.round((modProgress.stars / 3) * 100);

            let masteryText = 'Non Iniziato';
            let barColor = 'bg-slate-300';
            if (modProgress.stars === 1) {
              masteryText = 'Base (1/3)';
              barColor = 'bg-amber-400';
            } else if (modProgress.stars === 2) {
              masteryText = 'Buono (2/3)';
              barColor = 'bg-blue-500';
            } else if (modProgress.stars === 3) {
              masteryText = 'Eccellente / Padronanza (3/3)';
              barColor = 'bg-emerald-500';
            }

            return (
              <div key={mod.id} className={`space-y-1.5 border-b pb-3 last:border-b-0 last:pb-0 ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{mod.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{masteryText}</span>
                    <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{modProgress.stars} / 3 ⭐</span>
                  </div>
                </div>

                <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <motion.div
                    className={`h-full rounded-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${starPercent}%` }}
                    transition={{ duration: 0.7, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Attempt History Log */}
      <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center space-x-2 font-bold text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          <History className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-indigo-600'}`} />
          <h3>Storico dei Tentativi Recenti</h3>
        </div>

        {userProgress.attempts.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {userProgress.attempts.slice().reverse().map((attempt) => (
              <div
                key={attempt.id}
                className={`p-3 border rounded-xl flex items-center justify-between text-xs gap-3 ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <span className={`font-bold block ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{attempt.moduleTitle}</span>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Livello: <span className="uppercase font-semibold">{attempt.difficulty}</span> •{' '}
                    {new Date(attempt.timestamp).toLocaleString('it-IT')}
                  </span>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {attempt.score} / {attempt.totalQuestions} ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)
                  </span>
                  <span className="text-amber-500 font-bold">{attempt.starsEarned} ★</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Nessun tentativo registrato finora.</p>
        )}
      </div>

      {/* Reset Progress Action Box */}
      <div className={`border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDark
          ? 'bg-rose-950/40 border-rose-900 text-rose-200'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}>
        <div>
          <h4 className={`text-sm font-bold ${isDark ? 'text-rose-200' : 'text-rose-900'}`}>Ripristina Percorso e Progressi</h4>
          <p className={`text-xs ${isDark ? 'text-rose-300/80' : 'text-rose-700'}`}>
            Cancella le stelle, i tentativi e la serie giornaliera per ricominciare da capo.
          </p>
        </div>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Ripristina Progressi
          </button>
        ) : (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                onResetProgress();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1.5 bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs hover:bg-rose-800 transition-all cursor-pointer"
            >
              Conferma Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className={`px-3 py-1.5 font-bold text-xs rounded-lg transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Annulla
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
