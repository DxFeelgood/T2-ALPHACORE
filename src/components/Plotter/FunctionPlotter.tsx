import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { evaluate, derivative, simplify } from 'mathjs';
import { MathView } from '../MathView';
import { useTheme } from '../../context/ThemeContext';
import { ZoomIn, ZoomOut, RotateCcw, Move, Info, Sliders, CheckCircle, AlertCircle } from 'lucide-react';

interface PresetFunction {
  label: string;
  expression: string;
  description: string;
}

const PRESET_FUNCTIONS: PresetFunction[] = [
  { label: 'Polinomiale', expression: 'x^3 - 3*x', description: 'Polinomio di 3° grado con massimo e minimo locale' },
  { label: 'Razionale', expression: '(x^2 - 1) / (x - 2)', description: 'Funzione fratta con asintoto verticale in x=2 e obliquo y=x+2' },
  { label: 'Trigonometrica', expression: 'sin(x) * exp(-0.2*x)', description: 'Onda smorzata esponenzialmente' },
  { label: 'Logaritmica', expression: 'log(x^2 + 1)', description: 'Logaritmo pari sempre definito' },
  { label: 'Campana Gaussiana', expression: 'exp(-x^2)', description: 'Curva gaussiana simmetrica con massimo in x=0' },
  { label: 'Razionale Semplice', expression: '1 / (x^2 + 1)', description: 'Funzione sempre positiva con massimo in (0, 1)' },
];

export const FunctionPlotter: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'space';

  const [exprInput, setExprInput] = useState<string>('x^3 - 3*x');
  const [activePreset, setActivePreset] = useState<string>('x^3 - 3*x');

  // Graph Canvas View Transformation State
  const [zoom, setZoom] = useState<number>(40); // Pixels per unit
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // Center offset in pixels
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom evaluation point
  const [evalX, setEvalX] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derived analysis properties
  const analysis = useMemo(() => {
    try {
      if (!exprInput.trim()) return null;

      const derivNode = derivative(exprInput, 'x');
      const simplifiedDeriv = simplify(derivNode);
      const derivTex = simplifiedDeriv.toTex();

      // Sample grid points to find zeros, extrema, y-intercept
      const zeros: number[] = [];
      const extrema: { x: number; y: number; type: 'max' | 'min' }[] = [];
      const asymptotesV: number[] = [];

      const xMin = -10;
      const xMax = 10;
      const step = 0.05;

      let prevY: number | null = null;
      let prevDy: number | null = null;

      for (let x = xMin; x <= xMax; x += step) {
        let y: number | null = null;
        let dy: number | null = null;

        try {
          const val = evaluate(exprInput, { x });
          if (typeof val === 'number' && !isNaN(val) && isFinite(val) && Math.abs(val) < 1000) {
            y = val;
          }
        } catch {
          y = null;
        }

        try {
          const dVal = evaluate(simplifiedDeriv.toString(), { x });
          if (typeof dVal === 'number' && !isNaN(dVal) && isFinite(dVal)) {
            dy = dVal;
          }
        } catch {
          dy = null;
        }

        // Detect Vertical Asymptote (Discontinuity / Explosion)
        if (y === null && prevY !== null && Math.abs(prevY) > 20) {
          asymptotesV.push(Number(x.toFixed(2)));
        }

        // Detect Zeros (Sign Change)
        if (y !== null && prevY !== null) {
          if ((prevY < 0 && y >= 0) || (prevY > 0 && y <= 0)) {
            zeros.push(Number(x.toFixed(2)));
          }
        }

        // Detect Extrema (Derivative Sign Change)
        if (dy !== null && prevDy !== null && y !== null) {
          if (prevDy > 0 && dy <= 0) {
            extrema.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), type: 'max' });
          } else if (prevDy < 0 && dy >= 0) {
            extrema.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), type: 'min' });
          }
        }

        prevY = y;
        prevDy = dy;
      }

      // Y-intercept
      let yIntercept: number | null = null;
      try {
        const val0 = evaluate(exprInput, { x: 0 });
        if (typeof val0 === 'number' && !isNaN(val0) && isFinite(val0)) {
          yIntercept = Number(val0.toFixed(2));
        }
      } catch {
        yIntercept = null;
      }

      return {
        derivativeTex: derivTex,
        derivativeStr: simplifiedDeriv.toString(),
        zeros: Array.from(new Set(zeros)),
        yIntercept,
        extrema,
        asymptotesV: Array.from(new Set(asymptotesV)),
        isValid: true,
      };
    } catch {
      return { isValid: false, derivativeTex: '', derivativeStr: '', zeros: [], yIntercept: null, extrema: [], asymptotesV: [] };
    }
  }, [exprInput]);

  // Render Canvas Plot
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Center coordinates
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;

    // Background fill for dark theme canvas
    if (isDark) {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
    }

    // 1. Draw Grid Lines & Numbers
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';

    const gridStep = zoom; // 1 unit in pixels

    // Vertical Grid Lines
    for (let x = centerX % gridStep; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const mathX = Math.round((x - centerX) / zoom);
      if (mathX !== 0) {
        ctx.fillText(mathX.toString(), x - 4, centerY + 14);
      }
    }

    // Horizontal Grid Lines
    for (let y = centerY % gridStep; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      const mathY = Math.round((centerY - y) / zoom);
      if (mathY !== 0) {
        ctx.fillText(mathY.toString(), centerX + 6, y + 4);
      }
    }

    // 2. Draw X and Y Axes
    ctx.strokeStyle = isDark ? '#38bdf8' : '#1e293b';
    ctx.lineWidth = 2;

    // X-Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Origin label
    ctx.fillText('0', centerX - 10, centerY + 14);

    // 3. Draw Function Curve
    if (!exprInput.trim()) return;

    ctx.strokeStyle = isDark ? '#38bdf8' : '#1d4ed8'; // Bright Cyan in Deep Space, Deep Blue in Academic
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let isLineStarted = false;

    for (let pixelX = 0; pixelX < width; pixelX += 2) {
      const mathX = (pixelX - centerX) / zoom;
      try {
        const mathY = evaluate(exprInput, { x: mathX });

        if (typeof mathY === 'number' && !isNaN(mathY) && isFinite(mathY)) {
          const pixelY = centerY - mathY * zoom;

          // Guard against infinite bounds
          if (pixelY >= -500 && pixelY <= height + 500) {
            if (!isLineStarted) {
              ctx.moveTo(pixelX, pixelY);
              isLineStarted = true;
            } else {
              ctx.lineTo(pixelX, pixelY);
            }
          } else {
            isLineStarted = false;
          }
        } else {
          isLineStarted = false;
        }
      } catch {
        isLineStarted = false;
      }
    }

    ctx.stroke();

    // 4. Draw Critical Point Markers (Zeri, Y-Intercept, Extrema)
    if (analysis && analysis.isValid) {
      
      // Zeri (X-Intercepts) - Green Circles
      analysis.zeros.forEach((z) => {
        const px = centerX + z * zoom;
        const py = centerY;
        if (px >= 0 && px <= width) {
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#10b981'; // Green
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Y-Intercept - Amber Circle
      if (analysis.yIntercept !== null) {
        const px = centerX;
        const py = centerY - analysis.yIntercept * zoom;
        if (py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#f59e0b'; // Amber
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Extrema (Max / Min) - Purple / Rose Markers
      analysis.extrema.forEach((ext) => {
        const px = centerX + ext.x * zoom;
        const py = centerY - ext.y * zoom;
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, 2 * Math.PI);
          ctx.fillStyle = ext.type === 'max' ? '#8b5cf6' : '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

  }, [exprInput, zoom, offset, analysis, isDark]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Mouse Interactivity: Drag to Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 15), 150));
  };

  const handleResetView = () => {
    setZoom(40);
    setOffset({ x: 0, y: 0 });
  };

  const handleSelectPreset = (preset: PresetFunction) => {
    setExprInput(preset.expression);
    setActivePreset(preset.expression);
    handleResetView();
  };

  // Evaluate single custom point
  const evaluatedYCustom = useMemo(() => {
    try {
      const res = evaluate(exprInput, { x: evalX });
      return typeof res === 'number' && !isNaN(res) ? res.toFixed(4) : 'Non Definito';
    } catch {
      return 'Errore';
    }
  }, [exprInput, evalX]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Intro Box */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Graficatore di Funzioni 2D in Tempo Reale</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Visualizzatore Grafico & Analisi Analitica $f(x)$
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Traccia qualsiasi funzione matematica. Trascina per spostare il grafico, usa lo zoom ed esamina il calcolo automatico dei punti critici (Zeri, Intercetta Y, Estremi e Derivata).
        </p>
      </div>

      {/* Preset Buttons & Custom Input */}
      <div className={`rounded-2xl p-5 border transition-colors shadow-xs space-y-4 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Preset Pills */}
        <div>
          <label className={`text-xs font-bold block uppercase mb-2 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Funzioni Preimpostate (Esempi Noti):
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_FUNCTIONS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreset === p.expression
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={p.description}
              >
                {p.label}: <span className="font-mono">{p.expression}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-1.5">
          <label className={`text-xs font-bold flex items-center space-x-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>Inserisci Funzione $f(x)$:</span>
          </label>
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-sm ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                f(x) =
              </span>
              <input
                type="text"
                value={exprInput}
                onChange={(e) => {
                  setExprInput(e.target.value);
                  setActivePreset('');
                }}
                placeholder="es. x^3 - 3*x oppure (x^2 - 1)/(x - 2)"
                className={`w-full pl-16 pr-4 py-2.5 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              />
            </div>
            <button
              onClick={handleResetView}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Vista</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Canvas Plotter Area with Controls Overlay */}
      <div className={`rounded-2xl p-4 shadow-sm relative overflow-hidden border ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Controls Overlay */}
        <div className="absolute top-6 right-6 z-10 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-xs text-white p-1.5 rounded-xl border border-slate-700 shadow-lg">
          <button
            onClick={() => handleZoom(10)}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Zoom Avanti (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-10)}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Zoom Indietro (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700" />
          <button
            onClick={handleResetView}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Centra Origine"
          >
            <Move className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-[450px] rounded-xl cursor-grab active:cursor-grabbing border touch-none ${
            isDark ? 'border-slate-800 bg-[#050814]' : 'border-slate-200 bg-slate-50'
          }`}
        />

        {/* Legend Overlay */}
        <div className={`mt-3 flex flex-wrap items-center justify-between text-xs gap-2 px-2 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <span className="flex items-center space-x-1.5">
              <span className={`w-3 h-3 rounded-full inline-block ${isDark ? 'bg-cyan-400' : 'bg-blue-600'}`}></span>
              <span>Curva $f(x)$</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>Zeri (X-Intercepts)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span>Intercetta Y</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
              <span>Massimo / Minimo</span>
            </span>
          </div>
          <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            💡 Trascina sul grafico per spostare il piano cartesiano
          </span>
        </div>

      </div>

      {/* Function Analysis Table */}
      {analysis && analysis.isValid ? (
        <div className={`rounded-2xl p-6 shadow-xs space-y-6 border ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-base">
            <Info className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <h3>Scheda di Analisi Matematica Automatica</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Dominio & Zeri */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold block text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>1. Zeri della Funzione $f(x) = 0$</span>
              {analysis.zeros.length > 0 ? (
                <div className={`font-semibold space-y-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {analysis.zeros.map((z, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>$x = {z}$ (Punto: $({z}, 0)$)</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">Nessuno zero reale individuato nel range [-10, 10]</p>
              )}
            </div>

            {/* Intercetta Y */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold block text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>2. Intercetta Asse $Y$ ($x = 0$)</span>
              {analysis.yIntercept !== null ? (
                <div className="text-amber-500 font-semibold flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>$y = {analysis.yIntercept}$ (Punto: $(0, {analysis.yIntercept})$)</span>
                </div>
              ) : (
                <p className="text-slate-500 italic">La funzione non è definita in $x = 0$</p>
              )}
            </div>

            {/* Derivata Prima */}
            <div className={`p-4 rounded-xl border space-y-2 md:col-span-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold block text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>3. Derivata Prima $f'(x)$</span>
              <div className="p-2.5 bg-slate-950 text-cyan-300 rounded-lg font-mono text-sm overflow-x-auto border border-slate-800">
                <MathView math={`f'(x) = ${analysis.derivativeTex}`} block />
              </div>
            </div>

            {/* Massimi e Minimi */}
            <div className={`p-4 rounded-xl border space-y-2 md:col-span-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold block text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>4. Punti Stazionari (Massimi & Minimi Locali)</span>
              {analysis.extrema.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.extrema.map((ext, idx) => (
                    <div key={idx} className={`p-2 rounded-lg border font-semibold ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <span className={ext.type === 'max' ? 'text-purple-400' : 'text-pink-400'}>
                        {ext.type === 'max' ? 'Massimo Locale' : 'Minimo Locale'}:
                      </span>{' '}
                      <span className={isDark ? 'text-slate-200 font-mono' : 'text-slate-800 font-mono'}>
                        $({ext.x}, {ext.y})$
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">Nessun punto di massimo o minimo locale identificato nel range</p>
              )}
            </div>

          </div>

          {/* Evaluate Custom X Input */}
          <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-3">
              <label className={`text-xs font-bold ${isDark ? 'text-cyan-300' : 'text-blue-900'}`}>Valuta $f(x)$ in un punto preciso $x$:</label>
              <input
                type="number"
                value={evalX}
                onChange={(e) => setEvalX(Number(e.target.value))}
                className={`w-24 px-3 py-1.5 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-blue-300 text-slate-900'
                }`}
              />
            </div>
            <div className={`text-sm font-extrabold px-4 py-1.5 rounded-lg border shadow-2xs ${
              isDark ? 'bg-slate-900 border-slate-800 text-cyan-300' : 'bg-white border-blue-200 text-blue-900'
            }`}>
              f({evalX}) = <span className={isDark ? 'text-cyan-400' : 'text-blue-700'}>{evaluatedYCustom}</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>La sintassi della funzione non è corretta o la funzione non è valida. Esempio valido: x^2 - 4</span>
        </div>
      )}

    </div>
  );
};
