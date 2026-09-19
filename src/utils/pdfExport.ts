import { jsPDF } from 'jspdf';
import { UserProgressState } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { getRankTitle } from './storage';

export function downloadProgressReportPDF(userProgress: UserProgressState): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Title Header
  doc.setFillColor(30, 58, 138); // Deep Blue #1E3A8A
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Matematica & Funzioni', 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Scheda di Studio e Report dei Progressi', 14, 21);

  const dateStr = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Data: ${dateStr}`, pageWidth - 14, 21, { align: 'right' });

  y = 36;

  // Compute stats
  let totalStars = 0;
  let completedModules = 0;
  Object.values(userProgress.modules).forEach((mod) => {
    totalStars += mod.stars;
    if (mod.stars >= 2) completedModules++;
  });

  const overallProgressPercent = Math.round((completedModules / 7) * 100);
  const rank = getRankTitle(totalStars);
  const accuracy = userProgress.totalQuestionsAnswered > 0
    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  // Progress Summary Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 32, 3, 3, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESOCONTO COMPLETO DELLO STUDENTE', 18, y + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Grado Raggiunto: ${rank.title}`, 18, y + 16);
  doc.text(`Avanzamento Globale: ${overallProgressPercent}% (${completedModules}/7 Moduli completati)`, 18, y + 22);
  doc.text(`Stelle Totali Guadagnate: ${totalStars} / 21 ⭐`, 18, y + 28);

  doc.text(`Esercizi Svolti: ${userProgress.totalQuestionsAnswered}`, 120, y + 16);
  doc.text(`Accuratezza Risposte: ${accuracy}%`, 120, y + 22);
  doc.text(`Serie Giornaliera (Streak): ${userProgress.dailyStreak.streakCount} Giorni 🔥`, 120, y + 28);

  y += 40;

  // Section Header: Formulario di Teoria per Modulo
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMULARIO E SCHEDE DI SINTESI', 14, y);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;

  MODULES_DATA.forEach((mod) => {
    // Check if space needed, add page if near bottom
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    const modProgress = userProgress.modules[mod.id] || { stars: 0 };

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${mod.title}  [${modProgress.stars} / 3 Stelle ⭐]`, 18, y + 6);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(mod.description, 18, y + 12, { maxWidth: pageWidth - 36 });

    // Formulas preview
    const formulaList = mod.theory.formulas.map(f => `${f.title}: ${f.latex}`).join('  |  ');
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(30, 58, 138);
    doc.text(`Formule: ${formulaList}`, 18, y + 20, { maxWidth: pageWidth - 36 });

    y += 30;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Matematica & Funzioni App - Pagina ${i} di ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
  }

  // Save the PDF file
  doc.save(`Matematica_e_Funzioni_Report_${dateStr.replace(/\s+/g, '_')}.pdf`);
}
