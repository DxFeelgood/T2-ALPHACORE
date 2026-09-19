import React, { useState } from 'react';
import { Map, LineChart, Calculator, CalendarCheck, BarChart3, Trophy, Users, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  streakCount: number;
  userLevel?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  streakCount,
  userLevel = 1,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(true);
  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;
  const { theme } = useTheme();

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalIsCollapsed(!internalIsCollapsed);
    }
  };

  const navItems = [
    {
      id: 'roadmap' as ActiveTab,
      label: 'Mappa Percorso',
      icon: Map,
      badge: '7 Moduli',
    },
    {
      id: 'plotter' as ActiveTab,
      label: 'Graficatore',
      icon: LineChart,
      badge: '2D/SVG',
    },
    {
      id: 'calculator' as ActiveTab,
      label: 'Calcolatrice & Solver',
      icon: Calculator,
      badge: 'Passo-Passo',
    },
    {
      id: 'daily' as ActiveTab,
      label: 'Sfida del Giorno',
      icon: CalendarCheck,
      badge: `${streakCount}d 🔥`,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'gamification' as ActiveTab,
      label: 'Trofei & Gamification',
      icon: Trophy,
      badge: `Lvl ${userLevel}`,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'groups' as ActiveTab,
      label: 'Aule & Gruppi Studio',
      icon: Users,
      badge: 'Social',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard & Stats',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`hidden md:flex flex-col shrink-0 min-h-[calc(100vh-65px)] no-print overflow-hidden relative transition-colors duration-300 border-r ${
          theme === 'space'
            ? 'bg-[#0a0e21] text-slate-300 border-indigo-900/60'
            : 'bg-[#f4f1e8] text-stone-800 border-amber-200/80'
        }`}
      >
        {/* Toggle Collapse Top Header */}
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
          {!isCollapsed && (
            <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              Navigazione
            </span>
          )}
          <button
            onClick={handleToggle}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ${
              isCollapsed ? 'mx-auto' : 'ml-auto'
            }`}
            title={isCollapsed ? 'Espandi Menu' : 'Comprimi Menu'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                } py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : theme === 'space'
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : theme === 'space'
                        ? 'text-slate-400'
                        : 'text-stone-500'
                  }`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-blue-500/40 text-white' : 'bg-slate-800 text-slate-400')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Informative Footer Card */}
        {!isCollapsed && (
          <div className="p-4 m-3 bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl text-xs text-slate-400">
            <div className="font-bold text-slate-200 mb-1 flex items-center space-x-1">
              <span>💡 100% Offline</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              I tuoi progressi e tentativi vengono salvati automaticamente nel browser.
            </p>
          </div>
        )}
      </motion.aside>

      {/* Mobile Bottom Tabbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 py-2 px-1 shadow-2xl no-print">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

