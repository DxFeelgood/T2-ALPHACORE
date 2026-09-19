import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MODULES_DATA } from '../../data/modulesData';
import { UserProgressState, QuizAttempt, ModuleData } from '../../types';
import { ModuleTheory } from './ModuleTheory';
import { ModuleQuiz } from './ModuleQuiz';
import { useTheme } from '../../context/ThemeContext';
import {
  Lock,
  Unlock,
  Star,
  BookOpen,
  CheckCircle2,
  X,
  Layers,
  FunctionSquare,
  TrendingUp,
  Activity,
  LineChart,
  Binary,
  Cpu,
} from 'lucide-react';

interface RoadmapViewProps {
  userProgress: UserProgressState;
  onQuizAttempt: (attempt: QuizAttempt) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Layers: Layers,
  FunctionSquare: FunctionSquare,
  TrendingUp: TrendingUp,
  Activity: Activity,
  LineChart: LineChart,
  Binary: Binary,
  Cpu: Cpu,
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({ userProgress, onQuizAttempt }) => {
  const [activeModuleModal, setActiveModuleModal] = useState<ModuleData | null>(null);
  const [modalTab, setModalTab] = useState<'theory' | 'quiz'>('theory');

  const { theme } = useTheme();
  const isDark = theme === 'space';

  const handleOpenModule = (mod: ModuleData) => {
    const modProgress = userProgress.modules[mod.id];
    if (!modProgress || !modProgress.unlocked) return; // Locked module
    setActiveModuleModal(mod);
    setModalTab('theory');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Roadmap Intro Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <span>🗺️ Percorso Guidato Sequenziale</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mappa del Percorso Didattico di Matematica
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Esplora i 7 moduli fondamentali dell'Analisi Matematica. Completa gli esercizi ottenendo almeno 2 Stelle per sbloccare il modulo successivo e scalare i gradi accademici!
          </p>
        </div>

        {/* Decorative Background Grid Pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-blue-300 text-9xl font-mono">
          ∫ f(x)dx
        </div>
      </motion.div>

      {/* Visual Interconnected Nodes Roadmap */}
      <div className="relative max-w-4xl mx-auto px-4 py-6">
        
        {/* Connecting Vertical Track Line */}
        <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-slate-300 -translate-x-1/2 hidden md:block rounded-full z-0" />

        <div className="space-y-8 relative z-10">
          {MODULES_DATA.map((mod, idx) => {
            const modProgress = userProgress.modules[mod.id] || {
              stars: 0,
              unlocked: mod.id === 1,
            };
            const isUnlocked = modProgress.unlocked;
            const IconComponent = ICON_MAP[mod.iconName] || Layers;
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08, ease: 'easeOut' }}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Node Card */}
                <div className="w-full md:w-1/2">
                  <motion.div
                    whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={() => isUnlocked && handleOpenModule(mod)}
                    className={`p-6 rounded-2xl border-2 transition-colors duration-200 relative group ${
                      isUnlocked
                        ? isDark
                          ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/60 hover:shadow-xl shadow-indigo-950/30 cursor-pointer'
                          : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-xl cursor-pointer'
                        : isDark
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                          : 'bg-slate-100/80 border-slate-200 opacity-70 cursor-not-allowed'
                    }`}
                  >
                    {/* Module Number Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isUnlocked
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                              : isDark
                                ? 'bg-slate-800 text-slate-500'
                                : 'bg-slate-300 text-slate-600'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Modulo {mod.id}
                        </span>
                      </div>

                      {/* Lock / Star Badge */}
                      {isUnlocked ? (
                        <div className={`flex items-center space-x-1 text-sm font-bold px-2.5 py-1 rounded-full border ${
                          isDark
                            ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                            : 'bg-amber-50 border-amber-200 text-amber-500'
                        }`}>
                          <span>{modProgress.stars} / 3</span>
                          <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                      ) : (
                        <div className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-400'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloccato</span>
                        </div>
                      )}
                    </div>

                    <h3 className={`text-base font-bold transition-colors ${
                      isDark ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-700'
                    }`}>
                      {mod.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {mod.description}
                    </p>

                    {/* Progress Bar & Status */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      {isUnlocked ? (
                        <span className="text-blue-600 flex items-center space-x-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Apri Teoria & Quiz →</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Ottieni 2★ nel Modulo {mod.id - 1} per sbloccare
                        </span>
                      )}

                      {modProgress.stars >= 2 && (
                        <span className="text-emerald-600 flex items-center space-x-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Superato</span>
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Central Node Circle for Timeline */}
                <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-white border-4 border-blue-600 shadow-md items-center justify-center font-bold text-sm text-blue-900 z-10">
                  {isUnlocked ? (
                    modProgress.stars >= 2 ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Unlock className="w-5 h-5 text-blue-600" />
                    )
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Empty Spacer Column for Alternating Grid */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Module Theory / Quiz Modal */}
      <AnimatePresence>
        {activeModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto no-print"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border my-8 ${
                isDark
                  ? 'bg-[#0a0e21] border-slate-800 text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              
              {/* Modal Header */}
              <div className={`sticky top-0 z-20 p-6 rounded-t-3xl border-b flex items-center justify-between ${
                isDark
                  ? 'bg-slate-900 text-white border-slate-800'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}>
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Modulo {activeModuleModal.id} di 7
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {activeModuleModal.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModuleModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className={`sticky top-[81px] z-10 border-b px-6 py-3 flex space-x-3 ${
                isDark
                  ? 'bg-slate-900/95 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}>
                <button
                  onClick={() => setModalTab('theory')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    modalTab === 'theory'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Scheda Teoria & Formule</span>
                </button>

                <button
                  onClick={() => setModalTab('quiz')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    modalTab === 'quiz'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Quiz ed Esercizi (3 Livelli)</span>
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6">
                {modalTab === 'theory' ? (
                  <ModuleTheory
                    module={activeModuleModal}
                    onStartQuiz={() => setModalTab('quiz')}
                  />
                ) : (
                  <ModuleQuiz
                    module={activeModuleModal}
                    currentModuleStars={userProgress.modules[activeModuleModal.id]?.stars || 0}
                    onCompleteQuiz={onQuizAttempt}
                  />
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

