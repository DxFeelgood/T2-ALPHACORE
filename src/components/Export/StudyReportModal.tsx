import React from 'react';
import { motion } from 'motion/react';
import { UserProgressState } from '../../types';
import { MODULES_DATA } from '../../data/modulesData';
import { downloadProgressReportPDF } from '../../utils/pdfExport';
import { MathView } from '../MathView';
import { getRankTitle } from '../../utils/storage';
import { X, Download, Printer, BookOpen, Award, GraduationCap } from 'lucide-react';

interface StudyReportModalProps {
  userProgress: UserProgressState;
  onClose: () => void;
}

export const StudyReportModal: React.FC<StudyReportModalProps> = ({
  userProgress,
  onClose,
}) => {
  let totalStars = 0;
  let completedModulesCount = 0;

  Object.values(userProgress.modules).forEach((mod) => {
    totalStars += mod.stars;
    if (mod.stars >= 2) completedModulesCount++;
  });

  const overallPercent = Math.round((completedModulesCount / 7) * 100);
  const rank = getRankTitle(totalStars);

  const handlePrintPage = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadProgressReportPDF(userProgress);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-6 text-slate-900"
      >
        
        {/* Modal Top Actions Header (hidden in print mode) */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white p-5 rounded-t-3xl border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-base font-extrabold">Report di Studio & Formulario PDF</h3>
              <p className="text-xs text-slate-400">Esporta la scheda completa per la stampa o conservazione offline</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Scarica PDF</span>
            </button>
            <button
              onClick={handlePrintPage}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Stampa</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-8 print:p-0">
          
          {/* Document Printable Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/src/assets/images/mathero_logo_1789732975918.jpg"
                alt="Mathero Logo"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Mathero
                </h1>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  Scheda di Studio Teorica e Resoconto Valutativo Personale
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <span className="font-bold text-slate-800 block">Report Ufficiale</span>
              <span>Data: {new Date().toLocaleDateString('it-IT')}</span>
            </div>
          </div>

          {/* Student Progress Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 print:bg-white print:border-slate-300">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <Award className="w-4 h-4 text-blue-700" />
              <h4>RESOCONTO PROGRESSI E VALUTAZIONE</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Grado</span>
                <span className="font-extrabold text-blue-800 text-sm">{rank.title}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Avanzamento</span>
                <span className="font-extrabold text-slate-900 text-sm">{overallPercent}% ({completedModulesCount}/7 Moduli)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Stelle Totali</span>
                <span className="font-extrabold text-amber-600 text-sm">{totalStars} / 21 ⭐</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Serie Attiva</span>
                <span className="font-extrabold text-rose-600 text-sm">{userProgress.dailyStreak.streakCount} Giorni 🔥</span>
              </div>
            </div>
          </div>

          {/* Formulario per Modulo */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-base border-b border-slate-200 pb-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <h3>FORMULARIO DI TEORIA E CONCETTI FONDAMENTALI (7 MODULI)</h3>
            </div>

            <div className="space-y-6">
              {MODULES_DATA.map((mod) => {
                const modProgress = userProgress.modules[mod.id] || { stars: 0 };
                return (
                  <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 page-break">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {mod.title}
                      </h4>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {modProgress.stars} / 3 Stelle ⭐
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mod.theory.overview}
                    </p>

                    {/* Key Formulas */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Formule e Teoremi Principali</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {mod.theory.formulas.map((form, fIdx) => (
                          <div key={fIdx} className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                            <span className="text-[11px] text-blue-300 font-semibold block">{form.title}</span>
                            <MathView math={form.latex} block className="text-white my-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
};

