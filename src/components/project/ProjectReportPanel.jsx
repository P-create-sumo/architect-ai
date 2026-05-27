import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import { estimateCosts } from '@/lib/costEstimator';
import { FileText, Download, Loader2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';

const fmt = (n) => n.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function ProjectReportPanel({ project, nodes, arrows, groups, canvasRef }) {
  const [notes, setNotes] = useState(project?.notes || '');
  const [generating, setGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleGenerateSummary = async () => {
    if (nodes.length === 0) return;
    setGenerating(true);
    const serviceList = [...new Set(nodes.map(n => n.serviceId))]
      .map(id => SERVICE_LIBRARY[id]?.fullName)
      .filter(Boolean)
      .join(', ');

    const estimate = estimateCosts(nodes);
    const totalMid = Math.round(Object.values(estimate).reduce((s, v) => s + v.mid, 0));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Sei un consulente IT esperto. Genera un executive summary professionale in italiano per una proposta tecnica al cliente "${project.client_name}" per il progetto "${project.name}".
      
Servizi cloud utilizzati: ${serviceList}
Stima costo mensile: €${fmt(totalMid)}
${notes ? `Note tecniche: ${notes}` : ''}

Scrivi un paragrafo professionale di 4-6 righe che spieghi l'architettura, i vantaggi per il cliente e il valore della soluzione. Usa un tono professionale e orientato al business.`,
    });

    setAiSummary(result);
    setGenerating(false);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Header
    doc.setFillColor(20, 23, 32);
    doc.rect(0, 0, pageW, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(project.name, margin, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 180);
    doc.text(`Cliente: ${project.client_name}`, margin, 32);
    doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, margin, 40);

    y = 60;

    // Description
    if (project.description) {
      doc.setTextColor(40, 40, 60);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Descrizione Progetto', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 100);
      const descLines = doc.splitTextToSize(project.description, pageW - margin * 2);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 10;
    }

    // AI Summary
    const summary = aiSummary || notes;
    if (summary) {
      doc.setTextColor(40, 40, 60);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 100);
      const summaryLines = doc.splitTextToSize(summary, pageW - margin * 2);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 5 + 10;
    }

    // Architecture components
    doc.setTextColor(40, 40, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Componenti Architetturali', margin, y);
    y += 8;

    const uniqueServices = [...new Set(nodes.map(n => n.serviceId))];
    uniqueServices.forEach(svcId => {
      const svc = SERVICE_LIBRARY[svcId];
      if (!svc) return;
      const count = nodes.filter(n => n.serviceId === svcId).length;
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(margin, y - 4, pageW - margin * 2, 12, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 60);
      doc.text(`${svc.fullName}`, margin + 4, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 120);
      doc.text(`×${count}  ·  ${svc.provider.toUpperCase()}  ·  ${svc.category}`, pageW - margin - 60, y + 4);
      y += 15;
      if (y > 260) { doc.addPage(); y = margin; }
    });

    y += 5;

    // Cost estimate
    const estimate = estimateCosts(nodes);
    const totalMin = Math.round(Object.values(estimate).reduce((s, v) => s + v.min, 0));
    const totalMax = Math.round(Object.values(estimate).reduce((s, v) => s + v.max, 0));
    const totalMid = Math.round((totalMin + totalMax) / 2);

    if (y > 230) { doc.addPage(); y = margin; }

    doc.setFillColor(20, 23, 32);
    doc.roundedRect(margin, y, pageW - margin * 2, 40, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Stima Costi Mensili', margin + 8, y + 12);
    doc.setFontSize(18);
    doc.setTextColor(120, 220, 160);
    doc.text(`€${fmt(totalMid)}`, margin + 8, y + 28);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 180);
    doc.text(`Range: €${fmt(totalMin)} – €${fmt(totalMax)} / mese`, margin + 80, y + 22);
    doc.text(`Annuale stimato: €${fmt(totalMid * 12)}`, margin + 80, y + 32);

    if (project.budget) {
      const diff = totalMid - project.budget;
      doc.setFontSize(9);
      doc.setTextColor(diff > 0 ? 255 : 120, diff > 0 ? 100 : 220, diff > 0 ? 100 : 120);
      doc.text(`Budget cliente: €${fmt(project.budget)} (${diff > 0 ? '+' : ''}€${fmt(diff)})`, margin + 8, y + 38);
    }

    y += 50;

    // Footer
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generato il ${new Date().toLocaleDateString('it-IT')} · IT Architect Studio`, margin, 285);

    doc.save(`${project.name.replace(/\s+/g, '_')}_report.pdf`);
    setExporting(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Report Cliente</h2>
          <FileText className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">Genera e scarica il report PDF</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1.5">Note Tecniche</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Inserisci note o dettagli sull'architettura da includere nel report..."
            rows={4}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        {/* AI Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-400">Executive Summary AI</label>
            <button
              onClick={handleGenerateSummary}
              disabled={generating || nodes.length === 0}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-600/20 text-violet-400 text-[10px] font-medium hover:bg-violet-600/30 transition-all disabled:opacity-40"
            >
              {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {generating ? 'Generando...' : 'Genera AI'}
            </button>
          </div>
          {aiSummary ? (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-[11px] text-slate-300 leading-relaxed">{aiSummary}</p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/30 border border-dashed border-slate-700 text-center">
              <p className="text-[11px] text-slate-600">Clicca "Genera AI" per creare un executive summary automatico</p>
            </div>
          )}
        </div>

        {/* Preview info */}
        <div className="rounded-xl p-3 bg-slate-800/30 border border-slate-700 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400">Il PDF includerà:</p>
          {[
            '✓ Intestazione con nome progetto e cliente',
            project.description ? '✓ Descrizione del progetto' : '○ Descrizione (non inserita)',
            aiSummary || notes ? '✓ Executive Summary' : '○ Executive Summary (non generato)',
            `✓ ${[...new Set(nodes.map(n => n.serviceId))].length} componenti architetturali`,
            '✓ Stima costi mensili e annuali',
            project.budget ? '✓ Comparazione con budget cliente' : '○ Budget (non impostato)',
          ].map((item, i) => (
            <p key={i} className={`text-[10px] ${item.startsWith('✓') ? 'text-slate-300' : 'text-slate-600'}`}>{item}</p>
          ))}
        </div>

        {/* Export button */}
        <button
          onClick={handleExportPDF}
          disabled={exporting || nodes.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all disabled:opacity-40 shadow-lg shadow-amber-500/20"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Esportando...' : 'Scarica Report PDF'}
        </button>

        {nodes.length === 0 && (
          <p className="text-center text-xs text-slate-600">Aggiungi componenti al diagramma per abilitare l'export</p>
        )}
      </div>
    </div>
  );
}