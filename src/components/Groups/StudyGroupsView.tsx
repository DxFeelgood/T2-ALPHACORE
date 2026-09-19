import React, { useState } from 'react';
import { UserProgressState, StudyGroup, GroupPrivacyPermission, Question } from '../../types';
import { INITIAL_DEMO_GROUPS } from '../../utils/gamification';
import { MODULES_DATA } from '../../data/modulesData';
import { MathView } from '../MathView';
import {
  Users,
  UserPlus,
  Share2,
  Swords,
  Layers,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Eye,
  Zap,
  Award,
  Sparkles,
  Plus,
  Send,
  Heart,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyGroupsViewProps {
  userProgress: UserProgressState;
  onUpdatePrivacy: (privacy: GroupPrivacyPermission) => void;
  onAddGroup: (group: StudyGroup) => void;
  onAwardXp: (amount: number) => void;
}

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  userProgress,
  onUpdatePrivacy,
  onAddGroup,
  onAwardXp,
}) => {
  const allGroups = userProgress.joinedGroups.length > 0 ? userProgress.joinedGroups : INITIAL_DEMO_GROUPS;

  const [selectedGroupId, setSelectedGroupId] = useState<string>(allGroups[0]?.id || 'group_polimi_2026');
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'heatmap' | 'battle' | 'notes' | 'privacy'>('heatmap');

  // Modals / Input states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Notes state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Math Battle state
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [battleOpponent, setBattleOpponent] = useState('Chiara V.');
  const [battleIdx, setBattleIdx] = useState(0);
  const [battleUserScore, setBattleUserScore] = useState(0);
  const [battleOpponentScore, setBattleOpponentScore] = useState(0);
  const [battleFinished, setBattleFinished] = useState(false);
  const [battleSelectedOpt, setBattleSelectedOpt] = useState<number | null>(null);

  const currentGroup = allGroups.find((g) => g.id === selectedGroupId) || allGroups[0];

  // Battle questions sample
  const battleQuestions: Question[] = [
    {
      id: 'b1',
      difficulty: 'intermedio',
      question: 'Quanto vale $\\lim_{x \\to 0} \\frac{\\sin(2x)}{x}$ ?',
      options: ['0', '1', '2', 'Non esiste'],
      correctAnswerIndex: 2,
      explanation: 'Sfruttando il limite notevole $\\lim_{x \\to 0} \\frac{\\sin(kx)}{x} = k$, con $k=2$ il risultato è $2$.',
    },
    {
      id: 'b2',
      difficulty: 'intermedio',
      question: 'Qual è la derivata di $f(x) = x^3 - 4x$ ?',
      options: ['$3x^2 - 4$', '$3x^2$', '$x^2 - 4$', '$3x - 4$'],
      correctAnswerIndex: 0,
      explanation: 'Applicando le regole di derivazione dei polinomi: $d/dx(x^3) = 3x^2$ e $d/dx(-4x) = -4$.',
    },
    {
      id: 'b3',
      difficulty: 'intermedio',
      question: 'Qual è il dominio di $f(x) = \\ln(x - 2)$ ?',
      options: ['$x > 0$', '$x > 2$', '$x \\ge 2$', '$x \\neq 2$'],
      correctAnswerIndex: 1,
      explanation: 'L\'argomento del logaritmo deve essere strettamente positivo: $x - 2 > 0 \\implies x > 2$.',
    },
    {
      id: 'b4',
      difficulty: 'avanzato',
      question: 'Quanto vale $\\int 2x \\, dx$ ?',
      options: ['$x^2 + C$', '$2x^2 + C$', '$x + C$', '$2 + C$'],
      correctAnswerIndex: 0,
      explanation: 'L\'integrale indefinito di $2x$ è $2 \\cdot \\frac{x^2}{2} + C = x^2 + C$.',
    },
    {
      id: 'b5',
      difficulty: 'avanzato',
      question: 'In un punto stazionario con $f\'(x) = 0$ e $f\'\'(x) > 0$, la funzione presenta:',
      options: ['Un punto di massimo locale', 'Un punto di minimo locale', 'Un punto di flesso', 'Un asintoto'],
      correctAnswerIndex: 1,
      explanation: 'Se la derivata seconda è positiva ($f\'\'(x) > 0$), la concavità è rivolta verso l\'alto, indicando un punto di minimo relativo.',
    },
  ];

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const group: StudyGroup = {
      id: `group_${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Gruppo di studio collaborativo per l\'Analisi Matematica.',
      code: newCode,
      createdAt: new Date().toISOString().split('T')[0],
      ownerId: 'user_current',
      members: [
        {
          id: 'user_current',
          name: userProgress.userName,
          avatar: userProgress.equippedAvatar,
          xp: userProgress.xp,
          level: userProgress.level,
          stars: userProgress.attempts.reduce((acc, a) => acc + a.starsEarned, 0),
          streak: userProgress.dailyStreak.streakCount,
          privacy: userProgress.privacySetting,
          lastActive: 'Ora',
          moduleMastery: { 1: 100, 2: 80, 3: 70, 4: 60, 5: 50, 6: 30, 7: 10 },
        },
      ],
      notes: [],
    };

    onAddGroup(group);
    setSelectedGroupId(group.id);
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    // Simulate join
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentGroup.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote = {
      id: `note_${Date.now()}`,
      authorName: userProgress.userName,
      authorAvatar: userProgress.equippedAvatar,
      timestamp: 'Adesso',
      title: noteTitle.trim(),
      content: noteContent.trim(),
      likes: 1,
    };

    currentGroup.notes.unshift(newNote);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleStartBattle = (opponentName: string) => {
    setBattleOpponent(opponentName);
    setIsBattleActive(true);
    setBattleIdx(0);
    setBattleUserScore(0);
    setBattleOpponentScore(0);
    setBattleFinished(false);
    setBattleSelectedOpt(null);
  };

  const handleBattleAnswer = (optIdx: number) => {
    if (battleSelectedOpt !== null) return;
    setBattleSelectedOpt(optIdx);

    const q = battleQuestions[battleIdx];
    const isUserCorrect = optIdx === q.correctAnswerIndex;
    
    // Opponent random accuracy (~70% chance correct)
    const isOpponentCorrect = Math.random() < 0.7;

    let newUserScore = battleUserScore;
    let newOpponentScore = battleOpponentScore;

    if (isUserCorrect) newUserScore += 1;
    if (isOpponentCorrect) newOpponentScore += 1;

    setBattleUserScore(newUserScore);
    setBattleOpponentScore(newOpponentScore);

    setTimeout(() => {
      if (battleIdx + 1 < battleQuestions.length) {
        setBattleIdx((prev) => prev + 1);
        setBattleSelectedOpt(null);
      } else {
        // Finish battle
        setBattleFinished(true);
        if (newUserScore > newOpponentScore) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          onAwardXp(150); // Award XP for winning
        } else {
          onAwardXp(50);
        }
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Modalità Collaborativa & Aule di Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentGroup.name}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              {currentGroup.description}
            </p>
          </div>

          {/* Invite Code & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl border border-slate-700 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
              <span>Codice: <strong className="font-mono text-white">{currentGroup.code}</strong></span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crea Gruppo</span>
            </button>
          </div>
        </div>

        {/* Group Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">I tuoi Gruppi:</span>
          {allGroups.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSelectedGroupId(grp.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedGroupId === grp.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {grp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs overflow-x-auto">
        {[
          { id: 'heatmap', label: 'Heatmap Competenze', icon: Layers },
          { id: 'battle', label: 'Math Battle 1v1', icon: Swords },
          { id: 'notes', label: 'Appunti Condivisi', icon: MessageSquare },
          { id: 'members', label: 'Membri Gruppo', icon: Users },
          { id: 'privacy', label: 'Permessi Privacy', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Competency Heatmap */}
      {activeSubTab === 'heatmap' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Heatmap delle Competenze di Gruppo</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizza i punti di forza e le argomentazioni che richiedono maggiore ripasso collettivo.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {currentGroup.members.length} Studenti Attivi
            </span>
          </div>

          {/* Module Mastery Grid */}
          <div className="space-y-4">
            {MODULES_DATA.map((mod) => {
              // Calculate group average for this module
              let sum = 0;
              let count = 0;
              currentGroup.members.forEach((m) => {
                sum += m.moduleMastery[mod.id] || 50;
                count++;
              });

              const avgMastery = Math.round(sum / count);

              let badgeColor = 'bg-emerald-500 text-white';
              let badgeLabel = 'Ottimo';
              if (avgMastery < 50) {
                badgeColor = 'bg-rose-500 text-white';
                badgeLabel = 'Richiede Ripasso';
              } else if (avgMastery < 75) {
                badgeColor = 'bg-amber-500 text-white';
                badgeLabel = 'In Medio';
              }

              return (
                <div key={mod.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">{mod.title}</span>
                      <span className="text-[11px] text-slate-500">{mod.subtitle}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                      <span className="font-extrabold font-mono text-slate-900 text-sm">{avgMastery}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        avgMastery >= 75 ? 'bg-emerald-500' : avgMastery >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${avgMastery}%` }}
                    />
                  </div>

                  {/* Individual Member Indicators */}
                  <div className="flex items-center space-x-2 pt-1 overflow-x-auto">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Livello Singoli:</span>
                    {currentGroup.members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]"
                        title={`${m.name}: ${m.moduleMastery[mod.id] || 50}%`}
                      >
                        <span>{m.avatar}</span>
                        <span className="font-bold text-slate-700">{m.privacy === 'anonymous' ? 'Anonimo' : m.name.split(' ')[0]}</span>
                        <span className="text-slate-400 font-mono">({m.moduleMastery[mod.id] || 50}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Math Battle 1v1 */}
      {activeSubTab === 'battle' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Swords className="w-5 h-5 text-rose-600" />
                <span>Math Battle 1v1 (Duelli a Tempo)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Risolvi 5 quesiti a risposta rapida sfidando i tuoi compagni di studio!
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              +150 XP per Vittoria
            </span>
          </div>

          {!isBattleActive ? (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Scegli il tuo Avversario nel Gruppo:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentGroup.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:border-rose-300 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl bg-white p-2 rounded-xl border border-slate-200">{member.avatar}</span>
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm block">
                          {member.privacy === 'anonymous' ? 'Studente Anonimo' : member.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          Livello {member.level} • {member.stars} ★
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartBattle(member.name)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Swords className="w-4 h-4" />
                      <span>Sfida</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : !battleFinished ? (
            /* Active Battle Screen */
            <div className="space-y-6">
              
              {/* Battle Score Board */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between border border-slate-800 shadow-inner">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{userProgress.equippedAvatar}</span>
                  <div>
                    <span className="text-xs font-bold text-blue-400 block">{userProgress.userName}</span>
                    <span className="text-2xl font-black">{battleUserScore} Punti</span>
                  </div>
                </div>

                <div className="text-center font-bold text-rose-500 text-xl font-mono">
                  VS
                </div>

                <div className="flex items-center space-x-3 text-right">
                  <div>
                    <span className="text-xs font-bold text-rose-400 block">{battleOpponent}</span>
                    <span className="text-2xl font-black">{battleOpponentScore} Punti</span>
                  </div>
                  <span className="text-3xl">👩‍💻</span>
                </div>
              </div>

              {/* Question Header */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Quesito {battleIdx + 1} di {battleQuestions.length}
                </span>

                <div className="text-base font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <MathView textWithMath={battleQuestions[battleIdx].question} />
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {battleQuestions[battleIdx].options.map((opt, oIdx) => {
                  const isSelected = battleSelectedOpt === oIdx;
                  const isCorrect = oIdx === battleQuestions[battleIdx].correctAnswerIndex;

                  let style = 'bg-white border-slate-200 hover:border-rose-400 text-slate-800';
                  if (battleSelectedOpt !== null) {
                    if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    else if (isSelected && !isCorrect) style = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                    else style = 'bg-slate-50 border-slate-200 opacity-50';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleBattleAnswer(oIdx)}
                      disabled={battleSelectedOpt !== null}
                      className={`p-4 rounded-xl border-2 text-left text-sm font-bold transition-all cursor-pointer ${style}`}
                    >
                      <MathView textWithMath={opt} />
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Battle Finished Screen */
            <div className="text-center space-y-6 py-6">
              <div className="inline-flex p-4 rounded-full bg-amber-50 border border-amber-200 text-amber-500">
                <Award className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {battleUserScore > battleOpponentScore ? 'Vittoria Epica! 🎉' : 'Ottimo Duello! ⚔️'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Risultato finale: <strong>{battleUserScore}</strong> a <strong>{battleOpponentScore}</strong> punti.
                </p>
              </div>

              <button
                onClick={() => setIsBattleActive(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Torna alla Modalità Gruppo
              </button>
            </div>
          )}

        </div>
      )}

      {/* Sub-Tab 3: Shared Notes */}
      {activeSubTab === 'notes' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Bacheca Appunti e Formule Condivise</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pubblica suggerimenti, dimostrazioni o scorciatoie algebriche per i tuoi compagni.
              </p>
            </div>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleAddNote} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Scrivi un Nuovo Appunto:</span>
            <input
              type="text"
              placeholder="Titolo dell'appunto (es. Limiti Notevoli)..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
            />
            <textarea
              placeholder="Contenuto o formula LaTeX (es. \lim_{x \to 0} \frac{\sin x}{x} = 1)..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pubblica nella Bacheca</span>
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-4">
            {currentGroup.notes.map((note) => (
              <div key={note.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{note.authorAvatar}</span>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block">{note.authorName}</span>
                      <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                    </div>
                  </div>

                  <button className="flex items-center space-x-1 text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-bold cursor-pointer">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{note.likes}</span>
                  </button>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm">{note.title}</h4>
                <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MathView textWithMath={note.content} />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Sub-Tab 4: Group Members List */}
      {activeSubTab === 'members' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            Membri del Gruppo ({currentGroup.members.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentGroup.members.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl bg-white p-2 rounded-xl border border-slate-200">{m.avatar}</span>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {m.privacy === 'anonymous' ? 'Studente Anonimo' : m.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      Livello {m.level} • {m.stars} ★ • {m.streak}d 🔥
                    </span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                  {m.privacy}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Privacy Settings */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Configurazione Permessi di Privacy</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scegli quali informazioni condividere con i tuoi compagni nel gruppo.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'public' as GroupPrivacyPermission,
                title: 'Profilo Pubblico nel Gruppo (Consigliato)',
                desc: 'Condividi il tuo nome, livello, stelle guadagnate e la heatmap delle tue competenze per il lavoro di squadra.',
                icon: Eye,
              },
              {
                id: 'metrics_only' as GroupPrivacyPermission,
                title: 'Solo Metriche Generali',
                desc: 'Condividi unicamente il tuo livello e le stelle totali. Nasconde lo storico dei singoli errori nei quiz.',
                icon: Lock,
              },
              {
                id: 'anonymous' as GroupPrivacyPermission,
                title: 'Modalità Anonima',
                desc: 'Compari nel gruppo come "Studente Anonimo". I tuoi progressi contribuiscono alla media di gruppo in modo completamente riservato.',
                icon: ShieldCheck,
              },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = userProgress.privacySetting === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => onUpdatePrivacy(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="font-extrabold text-sm">{opt.title}</h4>
                    <p className="text-xs text-slate-600 leading-snug mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Crea un Nuovo Gruppo di Studio</h3>
            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Gruppo</label>
                <input
                  type="text"
                  required
                  placeholder="Es. Analisi 1 - Polimi 2026..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrizione</label>
                <textarea
                  placeholder="Descrivi l'obiettivo di studio del gruppo..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Crea Gruppo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
