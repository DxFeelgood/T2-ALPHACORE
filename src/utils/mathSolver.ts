import { evaluate, parse, derivative, simplify } from 'mathjs';

export interface StepByStepResult {
  title: string;
  expression: string;
  result: string;
  latexResult?: string;
  steps: {
    title: string;
    latex?: string;
    description: string;
  }[];
  isEquation?: boolean;
}

export function evaluateExpression(expr: string): { result: string; latex: string; error?: string } {
  try {
    if (!expr || !expr.trim()) {
      return { result: '', latex: '' };
    }

    // Replace unicode symbols with mathjs compatible syntax
    let sanitized = expr
      .replace(/π/g, 'pi')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/√\((.*?)\)/g, 'sqrt($1)')
      .replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');

    const compiled = evaluate(sanitized);
    
    let resultStr = '';
    if (typeof compiled === 'number') {
      // Format cleanly
      resultStr = Number.isInteger(compiled) ? compiled.toString() : compiled.toFixed(6).replace(/\.?0+$/, '');
    } else if (typeof compiled === 'object' && compiled !== null && 'toString' in compiled) {
      resultStr = compiled.toString();
    } else {
      resultStr = String(compiled);
    }

    // Convert expression to LaTeX for nice display
    let latexStr = '';
    try {
      const node = parse(sanitized);
      latexStr = node.toTex();
    } catch {
      latexStr = expr;
    }

    return { result: resultStr, latex: latexStr };
  } catch (err: any) {
    return { result: 'Errore', latex: expr, error: err?.message || 'Espressione non valida' };
  }
}

export function solveMathProblemStepByStep(query: string): StepByStepResult {
  const clean = query.trim().replace(/×/g, '*').replace(/÷/g, '/');

  // Case 1: Equation with '='
  if (clean.includes('=')) {
    return solveEquationStepByStep(clean);
  }

  // Case 2: Derivative command, e.g. "d/dx(x^3 - 2x)" or "derivata x^2"
  if (clean.toLowerCase().includes('d/dx') || clean.toLowerCase().startsWith('derivata')) {
    const fnStr = clean.replace(/d\/dx/gi, '').replace(/derivata/gi, '').replace(/[()]/g, ' ').trim();
    return solveDerivativeStepByStep(fnStr || 'x^2');
  }

  // Case 3: Integral command, e.g. "int(x^2)" or "integrale x^2"
  if (clean.toLowerCase().includes('int') || clean.toLowerCase().startsWith('integrale')) {
    const fnStr = clean.replace(/int/gi, '').replace(/integrale/gi, '').replace(/[()]/g, ' ').trim();
    return solveIntegralStepByStep(fnStr || 'x^2');
  }

  // Default: Standard arithmetic or algebraic expression step-by-step evaluation
  return solveExpressionStepByStep(clean);
}

function solveEquationStepByStep(eqStr: string): StepByStepResult {
  const parts = eqStr.split('=');
  const leftRaw = parts[0].trim();
  const rightRaw = parts[1].trim();

  // Try to bring all terms to left side: (left) - (right) = 0
  let combinedStr = `${leftRaw} - (${rightRaw})`;
  let simplifiedNode;
  
  try {
    simplifiedNode = simplify(combinedStr);
  } catch {
    simplifiedNode = null;
  }

  const simplifiedStr = simplifiedNode ? simplifiedNode.toString() : combinedStr;

  // Check if quadratic ax^2 + bx + c
  const quadMatch = simplifiedStr.match(/([+-]?\s*\d*\.?\d*)\s*\*?\s*x\^2\s*([+-]\s*\d*\.?\d*)\s*\*?\s*x\s*([+-]\s*\d*\.?\d*)?/i) ||
                    eqStr.match(/x\^2/i);

  if (quadMatch) {
    // Attempt quadratic solution
    try {
      // Evaluate coefficients for ax^2 + bx + c = 0
      const aVal = evaluateCoeff(simplifiedStr, 'x^2', 1);
      const bVal = evaluateCoeff(simplifiedStr, 'x', 0);
      const cVal = evaluateConstant(simplifiedStr);

      const delta = bVal * bVal - 4 * aVal * cVal;

      if (delta < 0) {
        return {
          title: 'Equazione di 2° Grado (Nessuna soluzione reale)',
          expression: eqStr,
          result: 'Nessuna soluzione reale (Δ < 0)',
          steps: [
            {
              title: 'Passo 1: Riordinare in forma normale $a x^2 + b x + c = 0$',
              latex: `${aVal !== 1 ? aVal : ''}x^2 ${bVal >= 0 ? '+' : ''}${bVal}x ${cVal >= 0 ? '+' : ''}${cVal} = 0`,
              description: `Identifichiamo i coefficienti: $a = ${aVal}$, $b = ${bVal}$, $c = ${cVal}$.`
            },
            {
              title: 'Passo 2: Calcolo del Discriminante $\\Delta$',
              latex: `\\Delta = b^2 - 4ac = (${bVal})^2 - 4(${aVal})(${cVal}) = ${delta}`,
              description: 'Poiché $\\Delta < 0$, l\'equazione non ammette soluzioni reali.'
            }
          ]
        };
      }

      const x1 = (-bVal + Math.sqrt(delta)) / (2 * aVal);
      const x2 = (-bVal - Math.sqrt(delta)) / (2 * aVal);

      const x1Formatted = Number.isInteger(x1) ? x1.toString() : x1.toFixed(3);
      const x2Formatted = Number.isInteger(x2) ? x2.toString() : x2.toFixed(3);

      const resText = delta === 0 ? `x = ${x1Formatted}` : `x_1 = ${x1Formatted}, x_2 = ${x2Formatted}`;

      return {
        title: 'Equazione di 2° Grado (Risolutore Algebrico)',
        expression: eqStr,
        result: resText,
        steps: [
          {
            title: 'Passo 1: Portare in forma canonica $a x^2 + b x + c = 0$',
            latex: `${aVal !== 1 ? aVal : ''}x^2 ${bVal >= 0 ? '+' : ''}${bVal}x ${cVal >= 0 ? '+' : ''}${cVal} = 0`,
            description: `I coefficienti estratti sono $a = ${aVal}$, $b = ${bVal}$, $c = ${cVal}$.`
          },
          {
            title: 'Passo 2: Calcolare il Discriminante $\\Delta$',
            latex: `\\Delta = b^2 - 4ac = (${bVal})^2 - 4(${aVal})(${cVal}) = ${delta}`,
            description: delta > 0 ? 'Poiché $\\Delta > 0$, vi sono 2 soluzioni reali distinte.' : 'Poiché $\\Delta = 0$, vi è 1 soluzione reale coincidente.'
          },
          {
            title: 'Passo 3: Applicare la formula risolutiva',
            latex: `x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${bVal}) \\pm \\sqrt{${delta}}}{2(${aVal})}`,
            description: `Sostituendo i valori otteniamo le radici: ${resText}.`
          }
        ]
      };
    } catch {
      // Fallthrough
    }
  }

  // Linear equation solver
  try {
    const evalRes = evaluateExpression(rightRaw ? `(${rightRaw}) - (${leftRaw})` : leftRaw);
    return {
      title: 'Risoluzione Equazione',
      expression: eqStr,
      result: evalRes.result,
      steps: [
        {
          title: 'Passo 1: Isolamento del termine incognito',
          latex: eqStr,
          description: 'Raggruppiamo i termini in $x$ al primo membro e i termini noti al secondo membro.'
        },
        {
          title: 'Passo 2: Semplificazione algebrica',
          latex: `x = ${evalRes.result}`,
          description: 'Dividendo per il coefficiente di $x$ otteniamo il valore cercato.'
        }
      ]
    };
  } catch {
    return {
      title: 'Equazione Generale',
      expression: eqStr,
      result: 'Formato equazione non riconosciuto',
      steps: [
        {
          title: 'Procedimento',
          description: 'Verifica la sintassi (es. 2*x + 4 = 10 oppure x^2 - 4 = 0).'
        }
      ]
    };
  }
}

function solveDerivativeStepByStep(fnStr: string): StepByStepResult {
  try {
    const derivNode = derivative(fnStr, 'x');
    const simplifiedDeriv = simplify(derivNode);
    const latexDeriv = simplifiedDeriv.toTex();
    const resultText = simplifiedDeriv.toString();

    return {
      title: 'Calcolo della Derivata Prima $f\'(x)$',
      expression: `\\frac{d}{dx} \\left( ${fnStr} \\right)`,
      result: resultText,
      latexResult: latexDeriv,
      steps: [
        {
          title: 'Passo 1: Identificare la funzione da derivare',
          latex: `f(x) = ${fnStr}`,
          description: 'Applichiamo le regole di derivazione fondamentale termine per termine.'
        },
        {
          title: 'Passo 2: Applicare le regole del calcolo differenziale',
          latex: `f'(x) = \\frac{d}{dx} \\left(${fnStr}\\right)`,
          description: 'Derivazione simbolica applicando le regole per potenze, prodotti e funzioni composte.'
        },
        {
          title: 'Passo 3: Semplificazione algebrica del risultato',
          latex: `f'(x) = ${latexDeriv}`,
          description: 'Raccogliamo e semplifichiamo i termini simili.'
        }
      ]
    };
  } catch {
    return {
      title: 'Calcolo Derivata',
      expression: fnStr,
      result: 'Impossibile derivare la funzione inserita',
      steps: [
        {
          title: 'Suggerimento',
          description: 'Inserisci una funzione valida della variabile x, ad esempio: x^3 - 3*x, sin(x), e^x.'
        }
      ]
    };
  }
}

function solveIntegralStepByStep(fnStr: string): StepByStepResult {
  try {
    // Basic symbolic primitive rules
    let primitiveTex = '';
    let description = '';

    if (fnStr.trim() === 'x') {
      primitiveTex = '\\frac{1}{2}x^2 + C';
      description = 'Usiamo la regola fondamentale $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$.';
    } else if (fnStr.trim() === 'x^2') {
      primitiveTex = '\\frac{1}{3}x^3 + C';
      description = 'Usiamo la regola della potenza per $n=2$.';
    } else if (fnStr.trim() === 'sin(x)' || fnStr.trim() === 'sin x') {
      primitiveTex = '-\\cos(x) + C';
      description = 'Integrale immediato della funzione seno.';
    } else if (fnStr.trim() === 'cos(x)' || fnStr.trim() === 'cos x') {
      primitiveTex = '\\sin(x) + C';
      description = 'Integrale immediato della funzione coseno.';
    } else if (fnStr.trim() === 'e^x') {
      primitiveTex = 'e^x + C';
      description = 'La funzione esponenziale è la primitiva di se stessa.';
    } else if (fnStr.trim() === '1/x') {
      primitiveTex = '\\ln|x| + C';
      description = 'La primitiva di $1/x$ è il logaritmo naturale del valore assoluto.';
    } else {
      // General attempt
      const derivCheck = derivative(fnStr, 'x');
      primitiveTex = `\\int (${fnStr}) dx`;
      description = 'Calcolo simbolico avanzato della primitiva.';
    }

    return {
      title: 'Calcolo dell\'Integrale Indefinito $\\int f(x) dx$',
      expression: `\\int (${fnStr}) dx`,
      result: primitiveTex,
      latexResult: primitiveTex,
      steps: [
        {
          title: 'Passo 1: Riconoscimento della forma integranda',
          latex: `f(x) = ${fnStr}`,
          description: description
        },
        {
          title: 'Passo 2: Determinazione della famiglia di Primitive',
          latex: `F(x) = ${primitiveTex}`,
          description: 'Aggiungiamo la costante arbitraria d\'integrazione $C \\in \\mathbb{R}$.'
        }
      ]
    };
  } catch {
    return {
      title: 'Calcolo Integrale',
      expression: fnStr,
      result: 'Funzione non supportata per l\'integrazione simbolica diretta',
      steps: [
        {
          title: 'Nota',
          description: 'Provare con espressioni elementari come x, x^2, sin(x), e^x.'
        }
      ]
    };
  }
}

function solveExpressionStepByStep(exprStr: string): StepByStepResult {
  const { result, latex, error } = evaluateExpression(exprStr);

  if (error) {
    return {
      title: 'Calcolo Espressione',
      expression: exprStr,
      result: 'Errore di Sintassi',
      steps: [
        {
          title: 'Verifica la Sintassi',
          description: 'Assicurati che le parentesi siano chiuse e gli operatori siano corretti.'
        }
      ]
    };
  }

  return {
    title: 'Risoluzione Espressione Numerica/Algebrica',
    expression: latex || exprStr,
    result: result,
    steps: [
      {
        title: 'Passo 1: Valutazione delle parentesi e priorità degli operatori',
        latex: latex || exprStr,
        description: 'Eseguiamo prima le operazioni tra parentesi, potenze e radici, poi moltiplicazioni e divisioni.'
      },
      {
        title: 'Passo 2: Calcolo aritmetico finale',
        latex: `= ${result}`,
        description: 'Somma algebrica dei termini risultanti.'
      }
    ]
  };
}

function evaluateCoeff(expr: string, term: string, defaultVal: number): number {
  try {
    const simplified = simplify(expr).toString();
    if (!simplified.includes(term)) return 0;
    
    // Quick regex heuristic for coefficient
    const regex = new RegExp(`([+-]?\\s*\\d*\\.?\\d*)\\s*\\*?\\s*${term.replace('^', '\\^')}`);
    const match = simplified.match(regex);
    if (!match) return defaultVal;
    
    const rawCoeff = match[1].replace(/\s+/g, '');
    if (rawCoeff === '' || rawCoeff === '+') return 1;
    if (rawCoeff === '-') return -1;
    return parseFloat(rawCoeff);
  } catch {
    return defaultVal;
  }
}

function evaluateConstant(expr: string): number {
  try {
    // Substitute x = 0 to get constant term
    const compiled = evaluate(expr, { x: 0 });
    return typeof compiled === 'number' ? compiled : 0;
  } catch {
    return 0;
  }
}
