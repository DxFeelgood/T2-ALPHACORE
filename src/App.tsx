/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from './context/ThemeContext';
import { UserProgressState, ActiveTab, QuizAttempt, GroupPrivacyPermission, StudyGroup } from './types';
import {
  loadUserProgress,
  saveUserProgress,
  resetAllUserProgress,
  getTodayDateString,
} from './utils/storage';
import { checkAndUnlockAchievements, calculateLevelFromXP } from './utils/gamification';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RoadmapView } from './components/Roadmap/RoadmapView';
import { FunctionPlotter } from './components/Plotter/FunctionPlotter';
import { ScientificCalculator } from './components/Calculator/ScientificCalculator';
import { DailyChallengeView } from './components/DailyChallenge/DailyChallengeView';
import { ProgressDashboard } from './components/Dashboard/ProgressDashboard';
import { StudyReportModal } from './components/Export/StudyReportModal';
import { GamificationHub } from './components/Gamification/GamificationHub';
import { StudyGroupsView } from './components/Groups/StudyGroupsView';
import matheroLogo from './assets/images/mathero_logo_1789732975918.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('roadmap');
  const [userProgress, setUserProgress] = useState<UserProgressState>(() => loadUserProgress());
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Sync state to localStorage on update and auto-check achievements
  useEffect(() => {
    saveUserProgress(userProgress);
  }, [userProgress]);

  // Award XP and check unlocked achievements
  const awardXpAndCheckBadges = (addedXp: number, state: UserProgressState): UserProgressState => {
    const newXp = (state.xp || 0) + addedXp;
    const { level: newLevel } = calculateLevelFromXP(newXp);
    const updatedWithXp = { ...state, xp: newXp, level: newLevel };
    const unlockedBadges = checkAndUnlockAchievements(updatedWithXp);
    return { ...updatedWithXp, unlockedBadges };
  };

  // Handle quiz completed attempt
  const handleQuizAttempt = (attempt: QuizAttempt) => {
    setUserProgress((prev) => {
      const currentMod = prev.modules[attempt.moduleId] || {
        stars: 0,
        baseCompleted: false,
        intermedioCompleted: false,
        avanzatoCompleted: false,
        bestScorePercentage: 0,
        unlocked: true,
      };

      const newStars = Math.max(currentMod.stars, attempt.starsEarned);
      const isBase = attempt.difficulty === 'base';
      const isIntermedio = attempt.difficulty === 'intermedio';
      const isAvanzato = attempt.difficulty === 'avanzato';

      const updatedModules = {
        ...prev.modules,
        [attempt.moduleId]: {
          ...currentMod,
          stars: newStars,
          baseCompleted: currentMod.baseCompleted || (isBase && attempt.score >= 2),
          intermedioCompleted: currentMod.intermedioCompleted || (isIntermedio && attempt.score >= 2),
          avanzatoCompleted: currentMod.avanzatoCompleted || (isAvanzato && attempt.score >= 1),
          lastAttemptAt: attempt.timestamp,
        },
      };

      // Sequential unlock rule: Module N+1 unlocks if Module N has >= 2 stars
      for (let id = 2; id <= 7; id++) {
        const prevMod = updatedModules[id - 1];
        if (prevMod && prevMod.stars >= 2) {
          updatedModules[id] = {
            ...updatedModules[id],
            unlocked: true,
          };
        }
      }

      // XP Reward calculation based on difficulty and score
      const xpReward = attempt.score * (attempt.difficulty === 'avanzato' ? 30 : attempt.difficulty === 'intermedio' ? 20 : 10) + attempt.starsEarned * 20;

      const updatedState: UserProgressState = {
        ...prev,
        modules: updatedModules,
        attempts: [...prev.attempts, attempt],
        totalQuestionsAnswered: prev.totalQuestionsAnswered + attempt.totalQuestions,
        totalCorrectAnswers: prev.totalCorrectAnswers + attempt.score,
      };

      return awardXpAndCheckBadges(xpReward, updatedState);
    });
  };

  // Handle daily challenge completed
  const handleDailyCompleted = (score: number, total: number) => {
    const todayStr = getTodayDateString();
    setUserProgress((prev) => {
      const currentStreak = prev.dailyStreak;
      const lastDate = currentStreak.lastCompletedDate;

      let newStreakCount = currentStreak.streakCount;

      if (lastDate !== todayStr) {
        newStreakCount += 1;
      }

      const updatedDaily = {
        ...currentStreak,
        lastCompletedDate: todayStr,
        streakCount: newStreakCount,
        bestStreak: Math.max(currentStreak.bestStreak, newStreakCount),
        todayCompleted: true,
        todayScore: score,
        history: [
          ...currentStreak.history,
          { date: todayStr, score, total },
        ],
      };

      const xpReward = score * 20 + 50 + newStreakCount * 10;

      const updatedState: UserProgressState = {
        ...prev,
        dailyStreak: updatedDaily,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + total,
        totalCorrectAnswers: prev.totalCorrectAnswers + score,
      };

      return awardXpAndCheckBadges(xpReward, updatedState);
    });
  };

  // Add calculation history item
  const handleAddCalcHistory = (item: { id: string; expression: string; result: string; timestamp: string }) => {
    setUserProgress((prev) => {
      const updatedHistory = [item, ...prev.calculatorHistory].slice(0, 30);
      const updatedState = { ...prev, calculatorHistory: updatedHistory };
      return awardXpAndCheckBadges(10, updatedState);
    });
  };

  const handleClearCalcHistory = () => {
    setUserProgress((prev) => ({
      ...prev,
      calculatorHistory: [],
    }));
  };

  // Handle avatar update
  const handleUpdateAvatar = (avatar: string) => {
    setUserProgress((prev) => ({ ...prev, equippedAvatar: avatar }));
  };

  // Handle user name update
  const handleUpdateUserName = (name: string) => {
    setUserProgress((prev) => ({ ...prev, userName: name }));
  };

  // Handle privacy update
  const handleUpdatePrivacy = (privacy: GroupPrivacyPermission) => {
    setUserProgress((prev) => ({ ...prev, privacySetting: privacy }));
  };

  // Handle group creation
  const handleAddGroup = (group: StudyGroup) => {
    setUserProgress((prev) => {
      const updated = {
        ...prev,
        joinedGroups: [...prev.joinedGroups, group],
      };
      return awardXpAndCheckBadges(100, updated);
    });
  };

  // Manual XP Awarding
  const handleAwardXp = (amount: number) => {
    setUserProgress((prev) => awardXpAndCheckBadges(amount, prev));
  };

  // Reset entire progress
  const handleResetProgress = () => {
    const defaultState = resetAllUserProgress();
    setUserProgress(defaultState);
  };

  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased relative transition-colors duration-300 ${
      theme === 'space'
        ? 'bg-[#050814] text-slate-100 dark'
        : 'bg-[#fcfbf7] text-stone-900'
    }`}>
      
      {/* Fixed Background Transparent Logo Watermark */}
      <div className={`fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden select-none transition-all duration-300 ${
        theme === 'space' ? 'opacity-[0.08] mix-blend-screen invert brightness-125' : 'opacity-[0.05]'
      }`}>
        <img
          src={matheroLogo}
          alt=""
          className="w-[90vw] max-w-4xl h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Top Header Navbar */}
      <div className="relative z-10">
        <Navbar
          userProgress={userProgress}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onResetProgress={handleResetProgress}
        />
      </div>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row w-full relative z-10">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          streakCount={userProgress.dailyStreak.streakCount}
          userLevel={userProgress.level}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Container with Animated Page Transitions */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {activeTab === 'roadmap' && (
                  <RoadmapView
                    userProgress={userProgress}
                    onQuizAttempt={handleQuizAttempt}
                  />
                )}

                {activeTab === 'plotter' && <FunctionPlotter />}

                {activeTab === 'calculator' && (
                  <ScientificCalculator
                    history={userProgress.calculatorHistory}
                    onAddHistory={handleAddCalcHistory}
                    onClearHistory={handleClearCalcHistory}
                  />
                )}

                {activeTab === 'daily' && (
                  <DailyChallengeView
                    userProgress={userProgress}
                    onCompleteDailyChallenge={handleDailyCompleted}
                  />
                )}

                {activeTab === 'gamification' && (
                  <GamificationHub
                    userProgress={userProgress}
                    onUpdateAvatar={handleUpdateAvatar}
                    onUpdateUserName={handleUpdateUserName}
                  />
                )}

                {activeTab === 'groups' && (
                  <StudyGroupsView
                    userProgress={userProgress}
                    onUpdatePrivacy={handleUpdatePrivacy}
                    onAddGroup={handleAddGroup}
                    onAwardXp={handleAwardXp}
                  />
                )}

                {activeTab === 'dashboard' && (
                  <ProgressDashboard
                    userProgress={userProgress}
                    onResetProgress={handleResetProgress}
                    onOpenReportModal={() => setIsReportModalOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>

      {/* Export Report / PDF Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <StudyReportModal
            userProgress={userProgress}
            onClose={() => setIsReportModalOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

