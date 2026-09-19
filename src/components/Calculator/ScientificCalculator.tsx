import React, { useState } from 'react';
import { solveMathProblemStepByStep, evaluateExpression } from '../../utils/mathSolver';
import { MathView } from '../MathView';
import { useTheme } from '../../context/ThemeContext';
import { Calculator as CalcIcon, History, Trash2, ArrowRight, Check, Zap } from 'lucide-react';

interface ScientificCalculatorProps {
  history: { id: string; expression: string; result: string; timestamp: string }[];
  onAddHistory: (item: { id: string; expression: string; result: string; timestamp: string }) => void;
  onClearHistory: () => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  history,
  onAddHistory,
  onClearHistory,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'space';

  const [inputExpr, setInputExpr] = useState<string>('2*x + 4 = 10');
  const [activeTab, setActiveTab] = useState<'solver' | 'keyboard'>('solver');
  const [stepByStepOutput, setStepByStepOutput] = useState(() => solveMathProblemStepByStep('2*x + 4 = 10'));

  const handleCalculate = () => {
    if (!inputExpr.trim()) return;
    const output = solveMathProblemStepByStep(inputExpr);
    setStepByStepOutput(output);

    onAddHistory({
      id: Date.now().toString(),
      expression: inputExpr,
      result: output.result,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleKeyPress = (val: string) => {
    setInputExpr((prev) => prev + val);
  };

  const handleClearInput = () => {
    setInputExpr('');
  };

  const handleBackspace = () => {
    setInputExpr((prev) => prev.slice(0, -1));
  };

  const handleReuseHistory = (itemExpr: string) => {
    setInputExpr(itemExpr);
    const output = solveMathProblemStepByStep(itemExpr);
    setStepByStepOutput(output);
  };

  const keyPadButtons = [
    { label: 'C', action: handleClearInput, color: isDark ? 'bg-rose-950/80 text-rose-300 border-rose-900' : 'bg-rose-100 text-rose-800 font-bold hover:bg-rose-200' },
    { label: '⌫', action: handleBackspace, color: isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-200 text-slate-800 font-bold hover:bg-slate-300' },
    { label: '(', action: () => handleKeyPress('('), color: isDark ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 font-bold' },
    { label: ')', action: () => handleKeyPress(')'), color: isDark ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 font-bold' },
    { label: '=', action: () => handleKeyPress(' = '), color: 'bg-blue-600 text-white font-bold' },

    { label: 'sin', action: () => handleKeyPress('sin('), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: 'cos', action: () => handleKeyPress('cos('), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: 'tan', action: () => handleKeyPress('tan('), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: 'ln', action: () => handleKeyPress('log('), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: '÷', action: () => handleKeyPress(' / '), color: isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-200 text-slate-900 font-bold' },

    { label: 'x²', action: () => handleKeyPress('^2'), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: 'x^y', action: () => handleKeyPress('^'), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: '√', action: () => handleKeyPress('sqrt('), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: 'π', action: () => handleKeyPress('π'), color: isDark ? 'bg-indigo-950/80 text-cyan-300 border-indigo-900' : 'bg-blue-50 text-blue-900 font-bold' },
    { label: '×', action: () => handleKeyPress(' * '), color: isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-200 text-slate-900 font-bold' },

    { label: '7', action: () => handleKeyPress('7'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: '8', action: () => handleKeyPress('8'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: '9', action: () => handleKeyPress('9'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: 'x', action: () => handleKeyPress('x'), color: isDark ? 'bg-purple-950/80 text-purple-300 border-purple-900' : 'bg-indigo-100 text-indigo-900 font-bold' },
    { label: '-', action: () => handleKeyPress(' - '), color: isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-200 text-slate-900 font-bold' },

    { label: '4', action: () => handleKeyPress('4'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: '5', action: () => handleKeyPress('5'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: '6', action: () => handleKeyPress('6'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: 'd/dx', action: () => handleKeyPress('d/dx('), color: isDark ? 'bg-purple-950/80 text-purple-300 border-purple-900' : 'bg-indigo-100 text-indigo-900 font-bold' },
    { label: '+', action: () => handleKeyPress(' + '), color: isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-200 text-slate-900 font-bold' },

    { label: '1', action: () => handleKeyPress('1'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: '2', action: () => handleKeyPress('2'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: '3', action: () => handleKeyPress('3'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
    { label: 'e', action: () => handleKeyPress('e'), color: isDark ? 'bg-purple-950/80 text-purple-300 border-purple-900' : 'bg-indigo-100 text-indigo-900 font-bold' },
    { label: '.', action: () => handleKeyPress('.'), color: isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-900 font-bold shadow-xs' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Intro Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <CalcIcon className="w-4 h-4" />
          <span>Calcolatrice Scientifica & Risolutore Passo-Passo</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Risolutore di Equazioni ed Espressioni
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Inserisci equazioni di 1° o 2° grado, espressioni o derivate (es. <span className="font-mono text-blue-300">2*x + 4 = 10</span>, <span className="font-mono text-blue-300">x^2 - 5*x + 6 = 0</span>, <span className="font-mono text-blue-300">d/dx(x^3)</span>) per ottenere la spiegazione algebrica completa passo-passo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Calculator Input & Keypad */}
        <div className={`lg:col-span-1 border rounded-2xl p-5 shadow-xs space-y-4 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {/* Main Input Display Screen */}
          <div className="bg-slate-950 text-white p-4 rounded-xl space-y-1 shadow-inner border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Display Input
            </span>
            <input
              type="text"
              value={inputExpr}
              onChange={(e) => setInputExpr(e.target.value)}
              placeholder="Inserisci espressione o equazione..."
              className="w-full bg-transparent text-lg font-mono font-bold text-cyan-300 focus:outline-none"
            />
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {keyPadButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className={`p-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 border cursor-pointer ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Calculate Solve Action Button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Risolvi Passo-Passo</span>
          </button>

        </div>

        {/* Right Column: Step-by-Step Solver Output & Calculation History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step-by-Step Solution Card */}
          {stepByStepOutput && (
            <div className={`border rounded-2xl p-6 shadow-xs space-y-6 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}>
              
              <div className={`flex items-center justify-between border-b pb-4 ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-cyan-400' : 'text-blue-600'
                  }`}>
                    {stepByStepOutput.title}
                  </span>
                  <h3 className={`text-lg font-extrabold mt-0.5 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    <MathView textWithMath={`$${stepByStepOutput.expression}$`} />
                  </h3>
                </div>

                <div className={`border px-4 py-2 rounded-xl text-center ${
                  isDark
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  <span className={`text-[10px] uppercase font-bold block ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Risultato Finale</span>
                  <span className="text-base font-extrabold font-mono">
                    {stepByStepOutput.result}
                  </span>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Procedimento Algebrico Svolto
                </h4>

                {stepByStepOutput.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-blue-600 space-y-1">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <h5 className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{step.title}</h5>
                    {step.latex && (
                      <MathView textWithMath={`$${step.latex}$`} block />
                    )}
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* History Box */}
          <div className={`border rounded-2xl p-5 shadow-xs space-y-4 ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-2 font-bold text-sm ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                <History className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`} />
                <span>Cronologia dei Calcoli</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Svuota</span>
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{item.expression}</span>
                      <span className="text-slate-500 mx-2">=</span>
                      <span className={`font-mono font-extrabold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>{item.result}</span>
                    </div>

                    <button
                      onClick={() => handleReuseHistory(item.expression)}
                      className={`px-2.5 py-1 font-bold rounded-lg transition-all text-[11px] shrink-0 cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-300'
                          : 'bg-white hover:bg-blue-50 border-slate-300 text-blue-700'
                      }`}
                    >
                      Riusa
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Nessun calcolo recente effettuato.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
