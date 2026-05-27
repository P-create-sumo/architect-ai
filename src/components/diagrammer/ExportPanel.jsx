import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Image, FileText, X, Loader2 } from 'lucide-react';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ExportPanel({ nodes, arrows, groups, onClose, canvasRef }) {
  const [exporting, setExporting] = useState(null); // 'png' | 'pdf' | null

  const captureCanvas = async () => {
    // Find the canvas element (the cream-colored diagram area)
    const canvasEl = canvasRef?.current;
    if (!canvasEl) throw new Error('Canvas non trovato');
    const canvas = await html2canvas(canvasEl, {
      backgroundColor: '#F5F0DC',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    return canvas;
  };

  const exportPNG = async () => {
    setExporting('png');
    const canvas = await captureCanvas();
    const link = document.createElement('a');
    link.download = `architettura-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setExporting(null);
  };

  const exportPDF = async () => {
    setExporting('pdf');
    const canvas = await captureCanvas();
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`architettura-${Date.now()}.pdf`);
    setExporting(null);
  };

  const nodeCount = nodes.length;
  const arrowCount = arrows.length;
  const providers = [...new Set(nodes.map(n => SERVICE_LIBRARY[n.serviceId]?.provider).filter(Boolean))];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      className="absolute top-full right-0 mt-1 w-64 rounded-2xl border border-slate-700 shadow-2xl z-30 overflow-hidden"
      style={{ background: '#1a1f2e' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <p className="text-[11px] font-bold text-white/90">Esporta Diagramma</p>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-700 text-slate-600 hover:text-slate-400 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="px-4 py-2.5 border-b border-slate-800">
        <div className="flex gap-3 text-[10px] text-slate-500">
          <span>{nodeCount} componenti</span>
          <span>·</span>
          <span>{arrowCount} connessioni</span>
          {providers.length > 0 && (
            <>
              <span>·</span>
              <span>{providers.join(', ').toUpperCase()}</span>
            </>
          )}
        </div>
      </div>

      {/* Export options */}
      <div className="p-3 space-y-2">
        <button
          onClick={exportPNG}
          disabled={!!exporting || nodeCount === 0}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {exporting === 'png' ? (
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
          ) : (
            <Image className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <div className="text-left">
            <p className="text-[11px] font-semibold text-white/80">Immagine PNG</p>
            <p className="text-[9px] text-slate-500">Alta risoluzione (2x)</p>
          </div>
        </button>

        <button
          onClick={exportPDF}
          disabled={!!exporting || nodeCount === 0}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {exporting === 'pdf' ? (
            <Loader2 className="w-4 h-4 text-red-400 animate-spin flex-shrink-0" />
          ) : (
            <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <div className="text-left">
            <p className="text-[11px] font-semibold text-white/80">Documento PDF</p>
            <p className="text-[9px] text-slate-500">Formato A4 landscape</p>
          </div>
        </button>

        {nodeCount === 0 && (
          <p className="text-[10px] text-slate-600 text-center pt-1">Aggiungi componenti al diagramma per esportarlo</p>
        )}
      </div>
    </motion.div>
  );
}