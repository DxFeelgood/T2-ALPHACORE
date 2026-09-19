import React from 'react';
import { ModuleData } from '../../types';
import { MathView } from '../MathView';
import { BookOpen, Key, Layers, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModuleTheoryProps {
  module: ModuleData;
  onStartQuiz: () => void;
}

export const ModuleTheory: React.FC<ModuleTheoryProps> = ({ module, onStartQuiz }) => {
  const { theory } = module;
  const { theme } = useTheme();

  const isDark = theme === 'space';

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className={`rounded-2xl p-5 border transition-colors ${
        isDark
          ? 'bg-indigo-950/40 border-indigo-900/60 text-slate-100'
          : 'bg-blue-50/70 border-blue-100 text-slate-900'
      }`}>
        <div className={`flex items-center space-x-2 font-bold text-base mb-2 ${
          isDark ? 'text-cyan-300' : 'text-blue-900'
        }`}>
          <BookOpen className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-700'}`} />
          <h3>Panoramica Teorica</h3>
        </div>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {theory.overview}
        </p>
      </div>

      {/* Key Concepts Grid */}
      <div>
        <div className={`flex items-center space-x-2 font-bold text-base mb-3 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          <Key className="w-5 h-5 text-amber-500" />
          <h3>Concetti Chiave</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {theory.keyConcepts.map((concept, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 border transition-colors shadow-xs ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h4 className="text-sm font-bold mb-1.5 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                <span>{concept.title}</span>
              </h4>
              {concept.latex && (
                <div className={`my-2 p-2 rounded-lg text-sm overflow-x-auto border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <MathView textWithMath={`$${concept.latex}$`} />
                </div>
              )}
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulas Box */}
      <div>
        <div className={`flex items-center space-x-2 font-bold text-base mb-3 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3>Formulario Principale (LaTeX)</h3>
        </div>
        <div className={`rounded-2xl p-5 shadow-inner space-y-4 border ${
          isDark
            ? 'bg-slate-950 border-slate-800 text-slate-100'
            : 'bg-slate-900 text-slate-100 border-slate-800'
        }`}>
          {theory.formulas.map((formula, idx) => (
            <div key={idx} className="border-b border-slate-800 last:border-b-0 pb-3 last:pb-0">
              <div className="text-xs text-slate-400 font-medium mb-1">{formula.title}</div>
              <MathView math={formula.latex} block className="text-blue-300" />
              {formula.notes && (
                <div className="text-[11px] text-slate-400 mt-1 italic">{formula.notes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Worked Example */}
      <div className={`rounded-2xl p-5 border shadow-xs space-y-4 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 font-bold text-base ${
            isDark ? 'text-emerald-400' : 'text-emerald-800'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3>Esempio Numerico Svolto Passo-Passo</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 font-semibold rounded-full border ${
            isDark
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            Guida Pratica
          </span>
        </div>

        <div className={`text-sm font-semibold p-3 rounded-xl border ${
          isDark
            ? 'bg-slate-950 border-slate-800 text-slate-200'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <span className={`${isDark ? 'text-cyan-400' : 'text-blue-700'} font-bold`}>Problema: </span>
          <MathView textWithMath={theory.workedExample.problem} />
        </div>

        <div className="space-y-3">
          {theory.workedExample.steps.map((step, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-blue-500 space-y-1">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {idx + 1}
              </div>
              <h4 className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{step.title}</h4>
              {step.latex && (
                <MathView textWithMath={`$${step.latex}$`} block />
              )}
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Start Quiz Action Footer */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onStartQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
        >
          <span>Metti alla prova le tue conoscenze (Quiz)</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};
