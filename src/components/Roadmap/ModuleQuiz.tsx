import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ModuleData, QuizAttempt } from '../../types';
import { MathView } from '../MathView';
import { CheckCircle2, XCircle, Award, RotateCcw, ChevronRight, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModuleQuizProps {
  module: ModuleData;
  onCompleteQuiz: (attempt: QuizAttempt) => void;
  currentModuleStars: number;
}

export const ModuleQuiz: React.FC<ModuleQuizProps> = ({
  module,
  onCompleteQuiz,
  currentModuleStars,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'space';

  const [selectedDifficulty, setSelectedDifficulty] = useState<'base' | 'intermedio' | 'avanzato'>('base');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const questionsList = module.quiz[selectedDifficulty];
  const currentQuestion = questionsList[currentQuestionIdx];

  const handleDifficultyChange = (level: 'base' | 'intermedio' | 'avanzato') => {
    setSelectedDifficulty(level);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    setIsAnswerSubmitted(true);

    setUserAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, isCorrect },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < questionsList.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finish Quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);
    
    // Calculate score
    const total = questionsList.length;
    const correct = userAnswers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correct / total) * 100);

    // Stars logic: Base = 1 star threshold, Intermedio = 2 star threshold, Avanzato = 3 star threshold
    let starsEarned = 0;
    if (percentage >= 60) {
      if (selectedDifficulty === 'base') starsEarned = Math.max(1, currentModuleStars);
      if (selectedDifficulty === 'intermedio') starsEarned = Math.max(2, currentModuleStars);
      if (selectedDifficulty === 'avanzato') starsEarned = 3;
    }

    if (starsEarned > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      moduleId: module.id,
      moduleTitle: module.title,
      difficulty: selectedDifficulty,
      score: correct,
      totalQuestions: total,
      starsEarned,
    };

    onCompleteQuiz(attempt);
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Difficulty Tabs */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl border ${
        isDark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-center space-x-1.5">
          {(['base', 'intermedio', 'avanzato'] as const).map((diff) => {
            const labels = { base: '⭐ Base (1 Stella)', intermedio: '⭐⭐ Intermedio (2 Stelle)', avanzato: '⭐⭐⭐ Avanzato (3 Stelle)' };
            const isActive = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {labels[diff]}
              </button>
            );
          })}
        </div>
        <div className={`text-xs font-medium px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Domanda {currentQuestionIdx + 1} di {questionsList.length}
        </div>
      </div>

      {!isQuizFinished ? (
        <div className={`rounded-2xl p-6 shadow-xs space-y-6 border ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {/* Question Box */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-cyan-400' : 'text-blue-600'
            }`}>
              <HelpCircle className="w-4 h-4" />
              <span>Domanda {currentQuestionIdx + 1}</span>
            </div>
            <div className={`text-base font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              <MathView textWithMath={currentQuestion.question} />
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQuestion.correctAnswerIndex;

              let optionStyle = isDark
                ? 'border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 hover:bg-slate-800/80 text-slate-100'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-800';

              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  optionStyle = isDark
                    ? 'border-emerald-500/80 bg-emerald-950/60 text-emerald-200 font-bold'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = isDark
                    ? 'border-rose-500/80 bg-rose-950/60 text-rose-200 font-bold'
                    : 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                } else {
                  optionStyle = isDark
                    ? 'border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-40'
                    : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = isDark
                  ? 'border-cyan-500 bg-cyan-950/50 text-cyan-200 font-bold ring-2 ring-cyan-500/30'
                  : 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-2 ring-blue-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="text-sm">
                      <MathView textWithMath={option} />
                    </div>
                  </div>

                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Explanation Box */}
          {isAnswerSubmitted && (
            <div
              className={`p-5 rounded-xl border space-y-2 ${
                selectedOption === currentQuestion.correctAnswerIndex
                  ? isDark ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isDark ? 'bg-rose-950/60 border-rose-800 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm">
                {selectedOption === currentQuestion.correctAnswerIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Esatto! Ottimo lavoro.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Risposta non corretta.</span>
                  </>
                )}
              </div>

              <div className={`pt-2 border-t text-xs leading-relaxed space-y-1 ${
                isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200/60 text-slate-800'
              }`}>
                <span className={`font-bold block ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Spiegazione Dettagliata Passo-Passo:
                </span>
                <MathView textWithMath={currentQuestion.explanation} />
              </div>
            </div>
          )}

          {/* Action Footer Button */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Conferma Risposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>
                  {currentQuestionIdx + 1 < questionsList.length
                    ? 'Prossima Domanda'
                    : 'Vedi Risultato Finale'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Quiz Finished Summary View */
        <div className={`rounded-2xl p-8 text-center space-y-6 shadow-sm border ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className={`inline-flex p-4 rounded-full border ${
            isDark ? 'bg-amber-950/60 border-amber-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-500'
          }`}>
            <Award className="w-12 h-12" />
          </div>

          <div>
            <h3 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Quiz Completato!</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Ecco la valutazione del tuo tentativo per il modulo
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs block uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Punteggio</span>
              <span className={`text-2xl font-extrabold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
                {userAnswers.filter((a) => a.isCorrect).length} / {questionsList.length}
              </span>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs block uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accuratezza</span>
              <span className="text-2xl font-extrabold text-emerald-500">
                {Math.round(
                  (userAnswers.filter((a) => a.isCorrect).length / questionsList.length) * 100
                )}%
              </span>
            </div>
          </div>

          {/* Stars Awarded */}
          <div className="flex items-center justify-center space-x-2 text-2xl">
            {[1, 2, 3].map((starNum) => {
              const isEarned =
                userAnswers.filter((a) => a.isCorrect).length / questionsList.length >= 0.6 &&
                ((selectedDifficulty === 'base' && starNum <= 1) ||
                  (selectedDifficulty === 'intermedio' && starNum <= 2) ||
                  (selectedDifficulty === 'avanzato' && starNum <= 3) ||
                  starNum <= currentModuleStars);

              return (
                <span
                  key={starNum}
                  className={isEarned ? 'text-amber-400 drop-shadow-md' : 'text-slate-300'}
                >
                  ★
                </span>
              );
            })}
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={restartQuiz}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Riprova Quiz</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
