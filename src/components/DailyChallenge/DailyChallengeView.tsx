import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MODULES_DATA } from '../../data/modulesData';
import { UserProgressState, Question } from '../../types';
import { MathView } from '../MathView';
import { getTodayDateString } from '../../utils/storage';
import { useTheme } from '../../context/ThemeContext';
import { Flame, Award, Calendar, CheckCircle2, XCircle, ArrowRight, Sparkles, Trophy } from 'lucide-react';

interface DailyChallengeProps {
  userProgress: UserProgressState;
  onCompleteDailyChallenge: (score: number, total: number) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeProps> = ({
  userProgress,
  onCompleteDailyChallenge,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'space';

  const todayStr = getTodayDateString();
  const dailyState = userProgress.dailyStreak;

  // Generate 5 questions based on today's date seed
  const todayQuestions: Question[] = useMemo(() => {
    const allQs: Question[] = [];
    MODULES_DATA.forEach((mod) => {
      allQs.push(...mod.quiz.base, ...mod.quiz.intermedio, ...mod.quiz.avanzato);
    });

    // Simple deterministic shuffle using today's date
    let seed = 0;
    for (let i = 0; i < todayStr.length; i++) {
      seed += todayStr.charCodeAt(i);
    }

    const shuffled = [...allQs].sort((a, b) => {
      const valA = (a.id.charCodeAt(0) * seed) % 100;
      const valB = (b.id.charCodeAt(0) * seed) % 100;
      return valA - valB;
    });

    return shuffled.slice(0, 5);
  }, [todayStr]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(dailyState.todayCompleted);

  const currentQ = todayQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isSubmitted) return;
    const isCorrect = selectedOpt === currentQ.correctAnswerIndex;
    setIsSubmitted(true);
    setUserAnswers((prev) => [...prev, { questionId: currentQ.id, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < todayQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      // Finish Daily Challenge
      finishDaily();
    }
  };

  const finishDaily = () => {
    setIsFinished(true);
    const score = userAnswers.filter((a) => a.isCorrect).length;
    
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    onCompleteDailyChallenge(score, todayQuestions.length);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Intro & Streak Tracker Header */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
            <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>Sfida del Giorno (5 Quesiti Misti)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Allenamento Giornaliero & Serie
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Metti alla prova la tua memoria a lungo termine risolvendo 5 quesiti estratti casualmente. Mantieni attiva la tua serie (Streak) giorno dopo giorno!
          </p>
        </div>

        {/* Streak Flame Box */}
        <div className="bg-slate-900/90 border border-rose-500/30 p-5 rounded-2xl flex items-center space-x-4 shrink-0 shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <Flame className="w-8 h-8 fill-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Serie Attuale</span>
            <span className="text-2xl font-extrabold text-rose-400">{dailyState.streakCount} Giorni 🔥</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Record: {dailyState.bestStreak} giorni</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Content */}
      {!isFinished ? (
        <div className={`border rounded-2xl p-6 shadow-xs space-y-6 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {/* Progress Header */}
          <div className={`flex items-center justify-between border-b pb-3 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              Domanda {currentIdx + 1} di {todayQuestions.length}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Punteggio Attuale: {userAnswers.filter((a) => a.isCorrect).length}
            </span>
          </div>

          {/* Question Box */}
          <div className="space-y-3">
            <div className={`text-base font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              <MathView textWithMath={currentQ.question} />
            </div>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === currentQ.correctAnswerIndex;

              let style = isDark
                ? 'border-slate-800 bg-slate-950 hover:border-rose-500 hover:bg-slate-900 text-slate-200'
                : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-slate-50 text-slate-800';

              if (isSubmitted) {
                if (isCorrectOpt) {
                  style = isDark
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  style = isDark
                    ? 'border-rose-500 bg-rose-950/60 text-rose-200 font-bold'
                    : 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                } else {
                  style = isDark
                    ? 'border-slate-800/50 bg-slate-950/40 text-slate-600 opacity-50'
                    : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = isDark
                  ? 'border-rose-500 bg-rose-950/40 text-rose-200 font-bold ring-2 ring-rose-500/20'
                  : 'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${style}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="text-sm">
                      <MathView textWithMath={option} />
                    </div>
                  </div>

                  {isSubmitted && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Solution Explanation */}
          {isSubmitted && (
            <div className={`p-4 rounded-xl border space-y-1.5 text-xs ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <span className={`font-bold block ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Spiegazione del Quesito:</span>
              <MathView textWithMath={currentQ.explanation} />
            </div>
          )}

          {/* Action Footer Button */}
          <div className="flex justify-end pt-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOpt === null}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Conferma Risposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>
                  {currentIdx + 1 < todayQuestions.length ? 'Prossimo Quesito' : 'Completa Sfida Giornaliera'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Completed Daily Challenge View */
        <div className={`border rounded-2xl p-8 text-center space-y-6 shadow-sm ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className={`inline-flex p-4 rounded-full border ${
            isDark ? 'bg-rose-950/50 border-rose-800 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-500'
          }`}>
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <h3 className={`text-2xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Sfida di Oggi Completata! 🎉
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Hai mantenuto attiva la tua serie di studio per oggi!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-xs text-slate-400 block uppercase font-bold">Punteggio Oggi</span>
              <span className="text-2xl font-extrabold text-rose-500">
                {dailyState.todayScore !== null ? dailyState.todayScore : userAnswers.filter((a) => a.isCorrect).length} / 5
              </span>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-xs text-slate-400 block uppercase font-bold">Serie (Streak)</span>
              <span className="text-2xl font-extrabold text-amber-500 flex items-center justify-center space-x-1">
                <span>{dailyState.streakCount}</span>
                <Flame className="w-6 h-6 fill-amber-400" />
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            Torna domani per affrontare la nuova sfida giornaliera e incrementare ulteriormente la tua serie!
          </p>
        </div>
      )}

    </div>
  );
};
