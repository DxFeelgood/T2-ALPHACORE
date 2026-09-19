import { ModuleData } from '../types';

export const MODULES_DATA: ModuleData[] = [
  {
    id: 1,
    slug: 'insieme-relazioni-insiemi-numerici',
    title: '1. Insiemi, Relazioni e Insiemi Numerici',
    subtitle: 'Fondata della matematica moderna',
    description: 'Comprendi la teoria degli insiemi, i diagrammi di Venn, i domini numerici (N, Z, Q, R) e il concetto di intervallo e relazione.',
    iconName: 'Layers',
    theory: {
      title: 'Insiemi, Relazioni e Insiemi Numerici',
      overview: 'La Teoria degli Insiemi costituisce il linguaggio fondamentale di tutta la matematica moderna. Un insieme è una collezione ben definita di oggetti distinti, detti elementi.',
      keyConcepts: [
        {
          title: 'Operazioni tra Insiemi',
          latex: 'A \\cup B, \\quad A \\cap B, \\quad A \\setminus B',
          description: 'L\'Unione ($A \\cup B$) comprende tutti gli elementi presenti in $A$ o $B$. L\'Intersezione ($A \\cap B$) contiene gli elementi comuni. La Differenza ($A \\setminus B$) contiene gli elementi di $A$ non appartenenti a $B$.'
        },
        {
          title: 'Gerarchia degli Insiemi Numerici',
          latex: '\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}',
          description: 'I numeri si classificano in Naturali ($\\mathbb{N}$), Interi relativi ($\\mathbb{Z}$), Razionali ($\\mathbb{Q}$), Reali ($\\mathbb{R}$) e Complessi ($\\mathbb{C}$).'
        },
        {
          title: 'Intervalli Reali',
          latex: '(a, b) = \\{x \\in \\mathbb{R} : a < x < b\\}, \\quad [a, b] = \\{x \\in \\mathbb{R} : a \\le x \\le b\\}',
          description: 'Un intervallo è un sottoinsieme di numeri reali compresi tra due estremi. Può essere aperto (parentesi tonde) o chiuso (parentesi quadre).'
        }
      ],
      formulas: [
        {
          title: 'Unione e Intersezione',
          latex: 'A \\cup B = \\{x : x \\in A \\lor x \\in B\\}, \\quad A \\cap B = \\{x : x \\in A \\land x \\in B\\}'
        },
        {
          title: 'Prodotto Cartesiano',
          latex: 'A \\times B = \\{(a, b) : a \\in A \\land b \\in B\\}'
        },
        {
          title: 'Leggi di De Morgan',
          latex: '\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}, \\quad \\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}'
        }
      ],
      workedExample: {
        problem: 'Siano $A = \\{x \\in \\mathbb{R} : x^2 - 4 < 0\\}$ e $B = [1, 5)$. Determinare l\'intersezione $A \\cap B$ e l\'unione $A \\cup B$.',
        steps: [
          {
            title: 'Passo 1: Risolvere la disequazione per l\'insieme A',
            latex: 'x^2 - 4 < 0 \\implies (x - 2)(x + 2) < 0 \\implies -2 < x < 2',
            description: 'L\'insieme $A$ corrisponde all\'intervallo aperto $(-2, 2)$.'
          },
          {
            title: 'Passo 2: Rappresentare gli intervalli A e B',
            latex: 'A = (-2, 2), \\quad B = [1, 5)',
            description: 'Disegniamo i due intervalli sulla retta reale.'
          },
          {
            title: 'Passo 3: Calcolare l\'intersezione A ∩ B',
            latex: 'A \\cap B = (-2, 2) \\cap [1, 5) = [1, 2)',
            description: 'Gli elementi in comune vanno da $x = 1$ (incluso) fino a $x = 2$ (escluso).'
          },
          {
            title: 'Passo 4: Calcolare l\'unione A ∪ B',
            latex: 'A \\cup B = (-2, 2) \\cup [1, 5) = (-2, 5)',
            description: 'L\'unione copre tutti i punti da $-2$ (escluso) fino a $5$ (escluso).'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q1_b1',
          difficulty: 'base',
          question: 'Quale dei seguenti insiemi rappresenta i numeri interi con segno?',
          options: ['$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{Q}$', '$\\mathbb{R}$'],
          correctAnswerIndex: 1,
          explanation: 'L\'insieme $\\mathbb{Z} = \\{..., -2, -1, 0, 1, 2, ...\\}$ indica l\'insieme dei numeri interi relativi.'
        },
        {
          id: 'q1_b2',
          difficulty: 'base',
          question: 'Siano $A = \\{1, 2, 3\\}$ e $B = \\{3, 4, 5\\}$. Qual è l\'intersezione $A \\cap B$?',
          options: ['$\\{1, 2, 3, 4, 5\\}$', '$\\{3\\}$', '$\\{1, 2\\}$', '$\\emptyset$'],
          correctAnswerIndex: 1,
          explanation: 'L\'intersezione $A \\cap B$ contiene gli elementi presenti in entrambi gli insiemi. L\'unico elemento comune è $3$.'
        }
      ],
      intermedio: [
        {
          id: 'q1_i1',
          difficulty: 'intermedio',
          question: 'Sia $A = (-3, 2]$ e $B = (0, 4)$. Qual è la differenza $A \\setminus B$?',
          options: ['$[2, 4)$', '$$(-3, 0]$$', '$$(0, 2]$$', '$$(-3, 0)$$'],
          correctAnswerIndex: 1,
          explanation: 'La differenza $A \\setminus B$ contiene i punti di $A$ che non appartengono a $B$. Poiché $B = (0, 4)$, togliendo da $(-3, 2]$ i punti superiori a $0$, otteniamo $(-3, 0]$.'
        },
        {
          id: 'q1_i2',
          difficulty: 'intermedio',
          question: 'Quanti elementi possiede l\'insieme delle parti $\\mathcal{P}(S)$ dell\'insieme $S = \\{a, b, c\\}$?',
          options: ['3', '6', '8', '9'],
          correctAnswerIndex: 2,
          explanation: 'Se un insieme ha $n$ elementi, il suo insieme delle parti contiene $2^n$ sottoinsiemi. Per $n=3$, $2^3 = 8$.'
        }
      ],
      avanzato: [
        {
          id: 'q1_a1',
          difficulty: 'avanzato',
          question: 'Sia $f: \\mathbb{R} \\to \\mathbb{R}$ definita da $f(x) = |x - 1|$. La relazione $R$ definita da $x R y \\iff f(x) = f(y)$ è un\'equivalenza. Qual è la classe di equivalenza di $x = 3$?',
          options: ['$\\{3\\}$', '$\\{-1, 3\\}$', '$\\{-3, 3\\}$', '$\\{1, 3\\}$'],
          correctAnswerIndex: 1,
          explanation: 'La classe di equivalenza di $3$ è l\'insieme di tutti gli $y$ tali che $|y - 1| = |3 - 1| = 2$. Quindi $y - 1 = 2 \\implies y = 3$ oppure $y - 1 = -2 \\implies y = -1$. La classe è $\\{-1, 3\\}$.'
        }
      ]
    }
  },
  {
    id: 2,
    slug: 'concetto-di-funzione-e-dominio',
    title: '2. Concetto di Funzione e Dominio',
    subtitle: 'Campi di esistenza e proprietà delle funzioni',
    description: 'Definizione formale di funzione $y = f(x)$, calcolo del Dominio di Esistenza (C.E.), iniettività, suriettività, biettività e simmetrie (pari/dispari).',
    iconName: 'FunctionSquare',
    theory: {
      title: 'Concetto di Funzione e Campo di Esistenza',
      overview: 'Una funzione $f$ da un insieme $A$ ad un insieme $B$ è una relazione che ad OGNI elemento $x \\in A$ associa UNO ED UN SOLO elemento $y \\in B$. L\'insieme $A$ è detto Dominio o Campo di Esistenza (C.E.).',
      keyConcepts: [
        {
          title: 'Regole per il Campo di Esistenza (C.E.)',
          latex: '\\text{Fratta: } Q(x) \\neq 0 \\quad | \\quad \\text{Radice pari: } A(x) \\ge 0 \\quad | \\quad \\text{Logaritmo: } A(x) > 0',
          description: 'Le restrizioni fondamentali derivano dall\'impossibilità di dividere per zero, di estrarre radici ad indice pari di numeri negativi e di calcolare logaritmi di valori non positivi.'
        },
        {
          title: 'Parità e Dispari',
          latex: 'f(-x) = f(x) \\implies \\text{Pari (Simmetria asse Y)}, \\quad f(-x) = -f(x) \\implies \\text{Dispari (Simmetria Origine)}',
          description: 'Le funzioni pari sono simmetriche rispetto all\'asse delle ordinate $Y$, mentre le funzioni dispari sono simmetriche rispetto all\'origine $O(0,0)$.'
        }
      ],
      formulas: [
        {
          title: 'Funzione Fratta',
          latex: 'f(x) = \\frac{P(x)}{Q(x)} \\implies D = \\{x \\in \\mathbb{R} : Q(x) \\neq 0\\}'
        },
        {
          title: 'Funzione Logaritmica',
          latex: 'f(x) = \\ln(g(x)) \\implies D = \\{x \\in \\mathbb{R} : g(x) > 0\\}'
        },
        {
          title: 'Composizione di Funzioni',
          latex: '(f \\circ g)(x) = f(g(x))'
        }
      ],
      workedExample: {
        problem: 'Determinare il campo di esistenza della funzione $f(x) = \\frac{\\sqrt{x + 3}}{\\ln(x - 1)}$.',
        steps: [
          {
            title: 'Passo 1: Condizione della Radice Quadrata',
            latex: 'x + 3 \\ge 0 \\implies x \\ge -3',
            description: 'L\'argomento della radice ad indice pari dev\'essere maggiore o uguale a zero.'
          },
          {
            title: 'Passo 2: Condizione del Logaritmo',
            latex: 'x - 1 > 0 \\implies x > 1',
            description: 'L\'argomento del logaritmo dev\'essere strettamente positivo.'
          },
          {
            title: 'Passo 3: Condizione del Denominatore',
            latex: '\\ln(x - 1) \\neq 0 \\implies x - 1 \\neq 1 \\implies x \\neq 2',
            description: 'Il denominatore non può essere nullo.'
          },
          {
            title: 'Passo 4: Sistema delle condizioni e soluzione finale',
            latex: '\\begin{cases} x \\ge -3 \\\\ x > 1 \\\\ x \\neq 2 \\end{cases} \\implies x \\in (1, 2) \\cup (2, +\\infty)',
            description: 'Intersecando tutte le condizioni otteniamo il Dominio: $D = (1, 2) \\cup (2, +\\infty)$.'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q2_b1',
          difficulty: 'base',
          question: 'Qual è il dominio della funzione $f(x) = \\frac{1}{x - 4}$?',
          options: ['$\\mathbb{R}$', '$\\mathbb{R} \\setminus \\{4\\}$', '$(4, +\\infty)$', '$(-\\infty, 4)$'],
          correctAnswerIndex: 1,
          explanation: 'Il denominatore non dev\'essere nullo: $x - 4 \\neq 0 \\implies x \\neq 4$. Il dominio è $\\mathbb{R} \\setminus \\{4\\}$.'
        },
        {
          id: 'q2_b2',
          difficulty: 'base',
          question: 'Se $f(x) = x^2 + 1$, come si definisce questa funzione rispetto alla parità?',
          options: ['Pari', 'Dispari', 'Né pari né dispari', 'Sia pari che dispari'],
          correctAnswerIndex: 0,
          explanation: 'Calcoliamo $f(-x) = (-x)^2 + 1 = x^2 + 1 = f(x)$. Poiché $f(-x) = f(x)$, la funzione è Pari.'
        }
      ],
      intermedio: [
        {
          id: 'q2_i1',
          difficulty: 'intermedio',
          question: 'Qual è il dominio di $f(x) = \\sqrt{\\frac{x - 2}{x + 1}}$?',
          options: ['$(-\\infty, -1) \\cup [2, +\\infty)$', '$(-1, 2]$', '$[2, +\\infty)$', '$(-\\infty, -1) \\cup (2, +\\infty)$'],
          correctAnswerIndex: 0,
          explanation: 'La frazione sotto radice dev\'essere $\\ge 0$ ed il denominatore $\\neq 0$. Dallo studio del segno di $\\frac{x - 2}{x + 1}$ otteniamo $x < -1$ oppure $x \\ge 2$. In notazione ad intervalli: $(-\\infty, -1) \\cup [2, +\\infty)$.'
        }
      ],
      avanzato: [
        {
          id: 'q2_a1',
          difficulty: 'avanzato',
          question: 'Per quale valore del parametro $k$ la funzione $f(x) = \\ln(x^2 + 2kx + 9)$ ha come dominio l\'intero insieme $\\mathbb{R}$?',
          options: ['$-3 < k < 3$', '$k > 3$', '$k < -3$', 'Per ogni $k \\in \\mathbb{R}$'],
          correctAnswerIndex: 0,
          explanation: 'Il dominio è $\\mathbb{R}$ se $x^2 + 2kx + 9 > 0$ per ogni $x \\in \\mathbb{R}$. Questo richiede $\\Delta < 0 \\implies (2k)^2 - 4(1)(9) < 0 \\implies 4k^2 - 36 < 0 \\implies k^2 < 9 \\implies -3 < k < 3$.'
        }
      ]
    }
  },
  {
    id: 3,
    slug: 'limiti-e-continuita',
    title: '3. Limiti e Continuità',
    subtitle: 'Comportamento locale ed asintotico',
    description: 'Concetto intuitivo e rigoroso di Limite ($\\epsilon - \\delta$), Forme Indeterminate ($\\frac{0}{0}, \\frac{\\infty}{\\infty}, 0 \\cdot \\infty$), Limiti Notevoli e Punti di Discontinuità (1°, 2°, 3° specie).',
    iconName: 'TrendingUp',
    theory: {
      title: 'Limiti e Continuità di una Funzione',
      overview: 'Il limite di una funzione studiare il valore a cui tende $f(x)$ quando la variabile $x$ si avvicina ad un punto $x_0$ o tende a $\\pm \\infty$.',
      keyConcepts: [
        {
          title: 'Definizione Rigorosa di Limite',
          latex: '\\lim_{x \\to x_0} f(x) = L \\iff \\forall \\epsilon > 0, \\exists \\delta > 0 : 0 < |x - x_0| < \\delta \\implies |f(x) - L| < \\epsilon',
          description: 'Indica che possiamo rendere $f(x)$ arbitrariamente vicina a $L$ scegliendo $x$ sufficientemente vicino a $x_0$.'
        },
        {
          title: 'Limiti Notevoli Fondamentali',
          latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}, \\quad \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e',
          description: 'Permettono di risolvere forme indeterminate fondamentali senza dover usare lo sviluppo in serie di Taylor.'
        },
        {
          title: 'Classificazione delle Discontinuità',
          latex: '\\text{1° Specie (Salto)}, \\quad \\text{2° Specie (Infinita)}, \\quad \\text{3° Specie (Eliminabile)}',
          description: '1° specie: i limiti destro e sinistro esistono finiti ma sono diversi. 2° specie: almeno uno dei limiti è infinito o non esiste. 3° specie: il limite esiste finito ma $f(x_0)$ non è definita o è diversa dal limite.'
        }
      ],
      formulas: [
        {
          title: 'Limite del Rapporto Incrementale (e Numero di Eulero)',
          latex: '\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{\\ln(1 + x)}{x} = 1'
        },
        {
          title: 'Teorema di De L\'Hôpital',
          latex: '\\lim_{x \\to x_0} \\frac{f(x)}{g(x)} = \\lim_{x \\to x_0} \\frac{f\'(x)}{g\'(x)} \\quad \\text{per forme } \\left[\\frac{0}{0}\\right] \\text{ o } \\left[\\frac{\\infty}{\\infty}\\right]'
        }
      ],
      workedExample: {
        problem: 'Calcolare il limite $\\lim_{x \\to 0} \\frac{1 - \\cos(3x)}{x \\cdot \\sin(2x)}$.',
        steps: [
          {
            title: 'Passo 1: Verificare la Forma Indeterminata',
            latex: '\\lim_{x \\to 0} \\frac{1 - \\cos(0)}{0 \\cdot \\sin(0)} = \\left[\\frac{0}{0}\\right]',
            description: 'Otteniamo una forma indeterminata $\\left[\\frac{0}{0}\\right]$. Risolviamo usando i limiti notevoli.'
          },
          {
            title: 'Passo 2: Riscrivere usando i Limiti Notevoli',
            latex: '\\frac{1 - \\cos(3x)}{x \\cdot \\sin(2x)} = \\frac{\\frac{1 - \\cos(3x)}{(3x)^2} \\cdot 9x^2}{x \\cdot \\frac{\\sin(2x)}{2x} \\cdot 2x}',
            description: 'Moltiplichiamo e dividiamo per gli argomenti appropriati.'
          },
          {
            title: 'Passo 3: Semplificare i termini algebrici',
            latex: '= \\frac{\\frac{1 - \\cos(3x)}{(3x)^2} \\cdot 9x^2}{\\frac{\\sin(2x)}{2x} \\cdot 2x^2} = \\frac{\\frac{1 - \\cos(3x)}{(3x)^2}}{\\frac{\\sin(2x)}{2x}} \\cdot \\frac{9}{2}',
            description: 'I termini $x^2$ al numeratore e denominatore si semplificano.'
          },
          {
            title: 'Passo 4: Sostituire i limiti notevoli',
            latex: '\\lim_{x \\to 0} \\frac{\\frac{1}{2}}{\\cdot 1} \\cdot \\frac{9}{2} = \\frac{1}{2} \\cdot \\frac{9}{2} = \\frac{9}{4}',
            description: 'Il valore del limite è $\\frac{9}{4}$.'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q3_b1',
          difficulty: 'base',
          question: 'Quanto vale il limite notevole $\\lim_{x \\to 0} \\frac{\\sin x}{x}$?',
          options: ['0', '1', '$\\infty$', 'Non esiste'],
          correctAnswerIndex: 1,
          explanation: '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ è il limite notevole trigonometrico fondamentale.'
        }
      ],
      intermedio: [
        {
          id: 'q3_i1',
          difficulty: 'intermedio',
          question: 'Calcolare $\\lim_{x \\to +\\infty} \\frac{3x^2 - 5x + 2}{2x^2 + 10}$.',
          options: ['0', '$\\frac{3}{2}$', '+$ \\infty$', '1'],
          correctAnswerIndex: 1,
          explanation: 'Per $x \\to \\infty$, prevalgono i termini di grado massimo al numeratore e denominatore: $\\lim_{x \\to \\infty} \\frac{3x^2}{2x^2} = \\frac{3}{2}$.'
        }
      ],
      avanzato: [
        {
          id: 'q3_a1',
          difficulty: 'avanzato',
          question: 'Che tipo di discontinuità presenta la funzione $f(x) = \\frac{|x - 2|}{x - 2}$ nel punto $x = 2$?',
          options: ['1° specie (Salto)', '2° specie (Infinita)', '3° specie (Eliminabile)', 'Nessuna discontinuità (È continua)'],
          correctAnswerIndex: 0,
          explanation: 'Per $x > 2$, $f(x) = 1 \\implies \\lim_{x \\to 2^+} f(x) = 1$. Per $x < 2$, $f(x) = -1 \\implies \\lim_{x \\to 2^-} f(x) = -1$. Entrambi i limiti sono finiti ma diversi; il salto vale $2$. Si tratta di discontinuità di 1° specie.'
        }
      ]
    }
  },
  {
    id: 4,
    slug: 'calcolo-differenziale-e-derivate',
    title: '4. Calcolo Differenziale e Derivate',
    subtitle: 'Tasso di variazione istantaneo e tangenti',
    description: 'Rapporto incrementale, significato geometrico della derivata prima $f\'(x)$, regole di derivazione (prodotto, quoziente, catena/composta) e punti di non derivabilità.',
    iconName: 'Activity',
    theory: {
      title: 'Calcolo Differenziale e Derivate',
      overview: 'La derivata di una funzione in un punto esprime la pendenza della retta tangente al grafico della funzione in quel punto, ovvero il tasso di variazione istantaneo.',
      keyConcepts: [
        {
          title: 'Definizione di Derivata tramite Rapporto Incrementale',
          latex: 'f\'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}',
          description: 'Se il limite esiste ed è finito, la funzione si dice derivabile in $x_0$.'
        },
        {
          title: 'Regole di Derivazione Fondamentali',
          latex: '(f \\cdot g)\' = f\'g + fg\', \\quad \\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}, \\quad [f(g(x))]\' = f\'(g(x)) \\cdot g\'(x)',
          description: 'Regole del prodotto (Leibniz), del quoziente e della funzione composta (Chain rule).'
        },
        {
          title: 'Punti di Non Derivabilità',
          latex: '\\text{Flesso a tangente verticale, Cuspide, Punto Angoloso}',
          description: 'Un punto angoloso si ha quando i limiti destro e sinistro del rapporto incrementale sono finiti ma diversi. Una cuspide si ha quando uno tende a $+\\infty$ e l\'altro a $-\\infty$.'
        }
      ],
      formulas: [
        {
          title: 'Derivate delle Funzioni Elementari',
          latex: '(x^n)\' = n x^{n-1}, \\quad (e^x)\' = e^x, \\quad (\\ln x)\' = \\frac{1}{x}, \\quad (\\sin x)\' = \\cos x, \\quad (\\cos x)\' = -\\sin x'
        },
        {
          title: 'Equazione della Retta Tangente',
          latex: 'y - f(x_0) = f\'(x_0)(x - x_0)'
        }
      ],
      workedExample: {
        problem: 'Calcolare la derivata della funzione composta $f(x) = (x^3 - 2x)^4$ e determinare l\'equazione della retta tangente in $x_0 = 1$.',
        steps: [
          {
            title: 'Passo 1: Applicare la Regola della Catena (Chain Rule)',
            latex: 'f\'(x) = 4(x^3 - 2x)^3 \\cdot \\frac{d}{dx}(x^3 - 2x)',
            description: 'Deriviamo la funzione esterna elevata alla quarta, poi moltiplichiamo per la derivata dell\'argomento interno.'
          },
          {
            title: 'Passo 2: Derivare il polinomio interno',
            latex: '\\frac{d}{dx}(x^3 - 2x) = 3x^2 - 2',
            description: 'Deriviamo termine per termine.'
          },
          {
            title: 'Passo 3: Scrivere l\'espressione completa della Derivata',
            latex: 'f\'(x) = 4(x^3 - 2x)^3 (3x^2 - 2)',
            description: 'Questa è la derivata prima $f\'(x)$.'
          },
          {
            title: 'Passo 4: Calcolare f(1) e f\'(1) per la Retta Tangente',
            latex: 'f(1) = (1 - 2)^4 = (-1)^4 = 1, \\quad f\'(1) = 4(1 - 2)^3 (3(1) - 2) = 4(-1)(1) = -4',
            description: 'La retta tangente in $x_0 = 1$ ha equazione $y - 1 = -4(x - 1) \\implies y = -4x + 5$.'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q4_b1',
          difficulty: 'base',
          question: 'Qual è la derivata prima di $f(x) = x^4 - 3x^2 + 5$?',
          options: ['$4x^3 - 6x$', '$4x^3 - 3x$', '$x^3 - 6x$', '$4x^3 - 6x + 5$'],
          correctAnswerIndex: 0,
          explanation: 'Derivando termine per termine con la regola della potenza $(x^n)\' = n x^{n-1}$: $(x^4)\' = 4x^3$, $(-3x^2)\' = -6x$, $(5)\' = 0$. Il risultato è $4x^3 - 6x$.'
        }
      ],
      intermedio: [
        {
          id: 'q4_i1',
          difficulty: 'intermedio',
          question: 'Qual è la derivata della funzione quoziente $f(x) = \\frac{\\sin x}{x}$?',
          options: ['$\\frac{\\cos x}{1}$', '$\\frac{x \\cos x - \\sin x}{x^2}$', '$\\frac{\\sin x - x \\cos x}{x^2}$', '$\\frac{-\\cos x}{x^2}$'],
          correctAnswerIndex: 1,
          explanation: 'Usando la regola del quoziente $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}$: con $u = \\sin x, u\' = \\cos x$ e $v = x, v\' = 1$, otteniamo $\\frac{x \\cos x - \\sin x}{x^2}$.'
        }
      ],
      avanzato: [
        {
          id: 'q4_a1',
          difficulty: 'avanzato',
          question: 'In quale punto la funzione $f(x) = |x^2 - 4|$ presenta un punto angoloso?',
          options: ['Solo in $x = 0$', 'Nei punti $x = 2$ e $x = -2$', 'In nessun punto', 'In $x = 4$'],
          correctAnswerIndex: 1,
          explanation: 'La funzione modulo si "spezza" dove l\'argomento si annulla, cioè in $x = \\pm 2$. Calcolando i limiti della derivata da destra e da sinistra in $x = 2$, otteniamo $+4$ da destra e $-4$ da sinistra. Quindi $x = \\pm 2$ sono punti angolosi.'
        }
      ]
    }
  },
  {
    id: 5,
    slug: 'studio-completo-di-funzione',
    title: '5. Studio Completo di Funzione',
    subtitle: 'Dalla formula al grafico cartesiano completo',
    description: 'Protocollo standard in 8 fasi per analizzare qualsiasi funzione: Dominio, Simmetrie, Intersezioni, Segno, Limiti & Asintoti, Derivata Prima (Monotonia/Estremi), Derivata Seconda (Concavità/Flessi) e Grafico.',
    iconName: 'LineChart',
    theory: {
      title: 'Studio Completo di una Funzione $y = f(x)$',
      overview: 'Lo studio di funzione è il processo analitico completo che permette di dedurre e tracciare con precisione il grafico qualitativo di una funzione sul piano cartesiano.',
      keyConcepts: [
        {
          title: 'I 8 Passaggi Fondamentali',
          latex: 'D \\to \\text{Simmetrie} \\to \\text{Intersezioni Asse } X,Y \\to \\text{Segno } f(x)>0 \\to \\text{Asintoti} \\to f\'(x) \\to f\'\'(x) \\to \\text{Grafico}',
          description: 'Seguire questa sequenza sistematica evita errori e copre tutte le proprietà geometriche della funzione.'
        },
        {
          title: 'Ricerca degli Asintoti',
          latex: '\\text{Vert: } \\lim_{x \\to x_0} f(x) = \\infty \\quad | \\quad \\text{Oriz: } \\lim_{x \\to \\infty} f(x) = L \\quad | \\quad \\text{Obliquo: } m = \\lim \\frac{f(x)}{x}, q = \\lim [f(x) - mx]',
          description: 'L\'asintoto verticale si trova nei punti di accumulazione fuori dal dominio. L\'asintoto orizzontale o obliquo descrive il comportamento all\'infinito.'
        },
        {
          title: 'Derivata Prima e Seconda',
          latex: 'f\'(x) > 0 \\implies \\text{Crescente}, \\quad f\'\'(x) > 0 \\implies \\text{Concavità verso l\'alto (Sorridente)}',
          description: '$f\'(x) = 0$ identifica i punti stazionari (Massimi/Minimi/Flessi Orizzontali). $f\'\'(x) = 0$ identifica i punti di Flesso dove cambia la concavità.'
        }
      ],
      formulas: [
        {
          title: 'Asintoto Obliquo $y = mx + q$',
          latex: 'm = \\lim_{x \\to \\pm \\infty} \\frac{f(x)}{x}, \\quad q = \\lim_{x \\to \\pm \\infty} [f(x) - m x]'
        },
        {
          title: 'Condizione di Massimo e Minimo Locale',
          latex: 'f\'(x_0) = 0 \\quad \\text{e} \\quad f\'\'(x_0) < 0 \\implies \\text{Massimo Relative}'
        }
      ],
      workedExample: {
        problem: 'Eseguire lo studio di funzione sintetico di $f(x) = \\frac{x^2 - 1}{x - 2}$.',
        steps: [
          {
            title: '1. Dominio e Intersezioni con gli assi',
            latex: 'D = \\mathbb{R} \\setminus \\{2\\}. \\quad f(0) = \\frac{0 - 1}{-2} = \\frac{1}{2} \\implies (0, 0.5). \\quad f(x) = 0 \\implies x = \\pm 1',
            description: 'Il punto $x = 2$ è escluso. Gli zeri della funzione sono $x = 1$ e $x = -1$.'
          },
          {
            title: '2. Limiti agli estremi del dominio e Asintoti',
            latex: '\\lim_{x \\to 2^+} \\frac{x^2 - 1}{x - 2} = +\\infty, \\quad \\lim_{x \\to 2^-} f(x) = -\\infty \\implies \\text{Asintoto Verticale: } x = 2',
            description: '$x = 2$ è un asintoto verticale bilatero.'
          },
          {
            title: '3. Asintoto Obliquo',
            latex: 'm = \\lim_{x \\to \\infty} \\frac{x^2 - 1}{x(x - 2)} = 1, \\quad q = \\lim_{x \\to \\infty} \\left[\\frac{x^2 - 1}{x - 2} - x\\right] = 2 \\implies y = x + 2',
            description: 'La retta $y = x + 2$ è l\'asintoto obliquo a $\\pm \\infty$.'
          },
          {
            title: '4. Derivata prima e Punti Critici',
            latex: 'f\'(x) = \\frac{2x(x - 2) - (x^2 - 1)(1)}{(x - 2)^2} = \\frac{x^2 - 4x + 1}{(x - 2)^2}',
            description: 'Annullando il numeratore $x^2 - 4x + 1 = 0$, otteniamo i punti stazionari $x = 2 \\pm \\sqrt{3}$. $x = 2 - \\sqrt{3} \\approx 0.27$ è un Massimo relativo, $x = 2 + \\sqrt{3} \\approx 3.73$ è un Minimo relativo.'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q5_b1',
          difficulty: 'base',
          question: 'Se per $x \\to +\\infty$ il limite $\\lim_{x \\to +\\infty} f(x) = 3$, quale retta rappresenta un asintoto per la funzione?',
          options: ['Asintoto verticale $x = 3$', 'Asintoto orizzontale $y = 3$', 'Asintoto obliquo $y = 3x$', 'Nessun asintoto'],
          correctAnswerIndex: 1,
          explanation: 'Se il limite all\'infinito è un numero finito $L = 3$, la retta orizzontale $y = 3$ è un Asintoto Orizzontale.'
        }
      ],
      intermedio: [
        {
          id: 'q5_i1',
          difficulty: 'intermedio',
          question: 'Dove si trova il minimo relativo della funzione $f(x) = x^2 - 4x + 7$?',
          options: ['In $x = 2$ con valore $y = 3$', 'In $x = -2$ con valore $y = 19$', 'In $x = 4$ con valore $y = 7$', 'In $x = 0$ con valore $y = 7$'],
          correctAnswerIndex: 0,
          explanation: 'Calcoliamo la derivata prima: $f\'(x) = 2x - 4$. Annullando la derivata: $2x - 4 = 0 \\implies x = 2$. Sostituendo nel testo: $f(2) = 2^2 - 4(2) + 7 = 4 - 8 + 7 = 3$. Il minimo si trova in $(2, 3)$.'
        }
      ],
      avanzato: [
        {
          id: 'q5_a1',
          difficulty: 'avanzato',
          question: 'Qual è il punto di flesso a concavità variabile per la funzione $f(x) = x^3 - 3x^2 + 2$?',
          options: ['$(1, 0)$', '$(0, 2)$', '$(2, -2)$', '$(-1, -2)$'],
          correctAnswerIndex: 0,
          explanation: 'Calcoliamo la derivata seconda: $f\'(x) = 3x^2 - 6x$, $f\'\'(x) = 6x - 6$. Annullando la derivata seconda: $6x - 6 = 0 \\implies x = 1$. Poiché la derivata seconda cambia segno attorno a $x = 1$, questo è un punto di flesso. Sostituendo $x = 1$: $f(1) = 1 - 3 + 2 = 0$. Il flesso è in $(1, 0)$.'
        }
      ]
    }
  },
  {
    id: 6,
    slug: 'calcolo-integrale',
    title: '6. Calcolo Integrale (Definiti e Indefiniti)',
    subtitle: 'Primitive, aree e Teorema Fondamentale del Calcolo',
    description: 'L\'integrale indefinito come operatore inverso della derivata, metodi di integrazione (sostituzione, per parti, fratti semplici) e l\'integrale definito per il calcolo di aree e volumi.',
    iconName: 'Binary',
    theory: {
      title: 'Calcolo Integrale: Indefinito e Definito',
      overview: 'L\'integrazione è l\'operazione inversa della derivazione. L\'integrale indefinito $\\int f(x) dx$ rappresenta la famiglia di tutte le primitive di $f(x)$, mentre l\'integrale definito $\\int_a^b f(x) dx$ calcola l\'area con segno compresa tra il grafico e l\'asse $X$.',
      keyConcepts: [
        {
          title: 'Teorema Fondamentale del Calcolo Integrale (Torricelli-Barrow)',
          latex: '\\int_a^b f(x) dx = G(b) - G(a) = [G(x)]_a^b',
          description: 'L\'integrale definito di una funzione continua si calcola valutando una qualsiasi sua primitiva $G(x)$ negli estremi di integrazione $b$ e $a$.'
        },
        {
          title: 'Integrazione per Parti',
          latex: '\\int u(x) v\'(x) dx = u(x) v(x) - \\int u\'(x) v(x) dx',
          description: 'Deriva dalla regola di derivazione del prodotto. Utilissima per prodotti di funzioni algebriche e trascendenti.'
        },
        {
          title: 'Integrazione per Sostituzione',
          latex: '\\int f(g(x)) g\'(x) dx = \\int f(t) dt \\quad \\text{con } t = g(x)',
          description: 'Trasforma un integrale complesso in uno più semplice cambiando la variabile di integrazione.'
        }
      ],
      formulas: [
        {
          title: 'Integrali Immediati Fondamentali',
          latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1), \\quad \\int \\frac{1}{x} dx = \\ln|x| + C, \\quad \\int e^x dx = e^x + C'
        },
        {
          title: 'Integrali Trigonometrici',
          latex: '\\int \\sin x dx = -\\cos x + C, \\quad \\int \\cos x dx = \\sin x + C'
        }
      ],
      workedExample: {
        problem: 'Calcolare l\'integrale definito $\\int_0^1 x \\cdot e^x dx$ usando l\'integrazione per parti.',
        steps: [
          {
            title: 'Passo 1: Scegliere u(x) e v\'(x)',
            latex: 'u(x) = x \\implies u\'(x) = 1, \\quad v\'(x) = e^x \\implies v(x) = e^x',
            description: 'Poniamo $u = x$ in modo che la sua derivata semplifichi l\'integrale residuo.'
          },
          {
            title: 'Passo 2: Applicare la formula di Integrazione per Parti',
            latex: '\\int x e^x dx = x e^x - \\int 1 \\cdot e^x dx = x e^x - e^x + C = e^x(x - 1) + C',
            description: 'Otteniamo la primitiva $G(x) = e^x(x - 1)$.'
          },
          {
            title: 'Passo 3: Calcolare gli estremi tramite la formula di Torricelli-Barrow',
            latex: '\\int_0^1 x e^x dx = [e^x(x - 1)]_0^1 = e^1(1 - 1) - e^0(0 - 1)',
            description: 'Valutiamo in $x = 1$ e in $x = 0$.'
          },
          {
            title: 'Passo 4: Risultato finale',
            latex: '= e^1(0) - 1(-1) = 0 - (-1) = 1',
            description: 'L\'area sottesa dalla curva vale esattamente $1$.'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q6_b1',
          difficulty: 'base',
          question: 'Qual è l\'integrale indefinito di $f(x) = 3x^2$?',
          options: ['$x^3 + C$', '$6x + C$', '$\\frac{3x^3}{2} + C$', '$x^2 + C$'],
          correctAnswerIndex: 0,
          explanation: 'Usando la regola della potenza: $\\int 3x^2 dx = 3 \\cdot \\frac{x^3}{3} + C = x^3 + C$.'
        }
      ],
      intermedio: [
        {
          id: 'q6_i1',
          difficulty: 'intermedio',
          question: 'Quanto vale l\'integrale definito $\\int_1^e \\frac{1}{x} dx$?',
          options: ['0', '1', '$e$', '$\\ln(2)$'],
          correctAnswerIndex: 1,
          explanation: 'La primitiva di $\\frac{1}{x}$ è $\\ln|x|$. Valutando negli estremi: $[\\ln x]_1^e = \\ln(e) - \\ln(1) = 1 - 0 = 1$.'
        }
      ],
      avanzato: [
        {
          id: 'q6_a1',
          difficulty: 'avanzato',
          question: 'Calcolare $\\int \\frac{2x}{x^2 + 1} dx$.',
          options: ['$\\ln(x^2 + 1) + C$', '$\\frac{x^2}{x^2 + 1} + C$', '$\\arctan(x) + C$', '$2\\ln(x) + C$'],
          correctAnswerIndex: 0,
          explanation: 'Notiamo che il numeratore $2x$ è esattamente la derivata del denominatore $x^2 + 1$. Trattandosi di una forma del tipo $\\int \\frac{f\'(x)}{f(x)} dx$, il risultato è $\\ln|f(x)| + C = \\ln(x^2 + 1) + C$.'
        }
      ]
    }
  },
  {
    id: 7,
    slug: 'introduzione-equazioni-differenziali',
    title: '7. Introduzione alle Equazioni Differenziali',
    subtitle: 'Modellizzare la dinamica ed il cambiamento',
    description: 'Equazioni differenziali ordinarie (ODE) del primo ordine: a variabili separabili, lineari omogenee ed autonome, con Problema di Cauchy (condizioni iniziali).',
    iconName: 'Cpu',
    theory: {
      title: 'Introduzione alle Equazioni Differenziali Ordinarie (ODE)',
      overview: 'Un\'equazione differenziale è un\'equazione che lega una funzione incognita $y(x)$ alle sue derivate $y\', y\'\', ...$. Modella fenomeni reali come la crescita di popolazioni, il decadimento radioattivo e il moto armonico.',
      keyConcepts: [
        {
          title: 'Equazioni a Variabili Separabili (1° Ordine)',
          latex: 'y\' = g(x) \\cdot h(y) \\implies \\int \\frac{1}{h(y)} dy = \\int g(x) dx',
          description: 'Permette di portare tutti i termini contenenti la variabile $y$ a sinistra e quelli con $x$ a destra per poi integrare separatamente.'
        },
        {
          title: 'Equazioni Lineari del Primo Ordine',
          latex: 'y\' + a(x)y = b(x) \\implies y(x) = e^{-A(x)} \\left( \\int b(x) e^{A(x)} dx + C \\right) \\quad \\text{dove } A(x) = \\int a(x)dx',
          description: 'Risolvibili tramite il metodo dell\'integrante esponenziale o variazione delle costanti.'
        },
        {
          title: 'Problema di Cauchy (Condizione Iniziale)',
          latex: '\\begin{cases} y\' = f(x, y) \\\\ y(x_0) = y_0 \\end{cases}',
          description: 'Consente di selezionare l\'UNICA soluzione particolare della famiglia infinita di curve integrali.'
        }
      ],
      formulas: [
        {
          title: 'Modello di Crescita / Decadimento Esponenziale',
          latex: 'y\' = k y \\implies y(x) = y_0 e^{k x}'
        },
        {
          title: 'Soluzione dell\'Equazione Lineare del 1° Ordine',
          latex: 'y(x) = e^{-\\int a(x)dx} \\left[ \\int b(x) e^{\\int a(x)dx} dx + C \\right]'
        }
      ],
      workedExample: {
        problem: 'Risolvere il Problema di Cauchy $\\begin{cases} y\' = 2x \\cdot y \\\\ y(0) = 3 \\end{cases}$.',
        steps: [
          {
            title: 'Passo 1: Separare le variabili',
            latex: '\\frac{dy}{dx} = 2x y \\implies \\frac{1}{y} dy = 2x dx \\quad (y \\neq 0)',
            description: 'Scriviamo $y\' = \\frac{dy}{dx}$ e spostiamo $y$ al denominatore di sinistra e $dx$ a destra.'
          },
          {
            title: 'Passo 2: Integrare entrambi i membri',
            latex: '\\int \\frac{1}{y} dy = \\int 2x dx \\implies \\ln|y| = x^2 + C_1',
            description: 'Calcoliamo le primitive indipendenti.'
          },
          {
            title: 'Passo 3: Esplicitare la funzione y(x)',
            latex: '|y| = e^{x^2 + C_1} = e^{C_1} \\cdot e^{x^2} \\implies y(x) = C e^{x^2}',
            description: 'Applichiamo l\'esponenziale a entrambi i membri definendo $C = \\pm e^{C_1}$.'
          },
          {
            title: 'Passo 4: Applicare la Condizione Iniziale y(0) = 3',
            latex: 'y(0) = C e^{0^2} = C \\cdot 1 = 3 \\implies C = 3',
            description: 'La soluzione unica del problema di Cauchy è $y(x) = 3 e^{x^2}$.'
          }
        ]
      }
    },
    quiz: {
      base: [
        {
          id: 'q7_b1',
          difficulty: 'base',
          question: 'Qual è l\'ordine dell\'equazione differenziale $y\'\' + 3y\' - 2y = e^x$?',
          options: ['1° ordine', '2° ordine', '3° ordine', 'Non è un\'equazione differenziale'],
          correctAnswerIndex: 1,
          explanation: 'L\'ordine di un\'equazione differenziale è dato dal massimo ordine di derivata presente. Essendoci $y\'\'$, l\'ordine è 2.'
        }
      ],
      intermedio: [
        {
          id: 'q7_i1',
          difficulty: 'intermedio',
          question: 'Qual è la soluzione generale dell\'equazione a variabili separabili $y\' = 4y$?',
          options: ['$y(x) = C e^{4x}$', '$y(x) = 2x^2 + C$', '$y(x) = C \\ln(4x)$', '$y(x) = 4x + C$'],
          correctAnswerIndex: 0,
          explanation: 'Dividendo per $y$: $\\int \\frac{1}{y} dy = \\int 4 dx \\implies \\ln|y| = 4x + C \\implies y(x) = C e^{4x}$.'
        }
      ],
      avanzato: [
        {
          id: 'q7_a1',
          difficulty: 'avanzato',
          question: 'Dato il Problema di Cauchy $\\begin{cases} y\' + 2y = 4 \\\\ y(0) = 5 \\end{cases}$, quale è la soluzione particolarizzata $y(x)$?',
          options: ['$y(x) = 3e^{-2x} + 2$', '$y(x) = 5e^{2x} - 1$', '$y(x) = 2e^{-2x} + 3$', '$y(x) = e^{-2x} + 4$'],
          correctAnswerIndex: 0,
          explanation: 'L\'equazione è lineare del 1° ordine con $a(x) = 2, b(x) = 4$. La soluzione generale è $y(x) = 2 + C e^{-2x}$. Imponendo $y(0) = 5 \\implies 2 + C = 5 \\implies C = 3$. Quindi $y(x) = 3e^{-2x} + 2$.'
        }
      ]
    }
  }
];
