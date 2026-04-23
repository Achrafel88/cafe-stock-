'use client';

import React from 'react';
import Shell from '@/components/Shell';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/utils/format';
import { 
  ArrowUpCircle, ArrowDownCircle, History as HistoryIcon, Clock, Package, ArrowRight, FileText, Printer, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import AnnualReportView from '@/components/AnnualReportView';

export default function HistoryPage() {
  const { movements, products } = useData();
  const [showReport, setShowReport] = React.useState<{ year: number, type: 'materiel' | 'cafe' } | null>(null);

  if (showReport) {
    return (
      <Shell>
        <div className="mb-8 flex justify-between items-center print:hidden bg-card p-6 rounded-3xl border border-card-border shadow-premium">
          <button onClick={() => setShowReport(null)} className="flex items-center gap-2 text-primary-600  hover:text-primary-600 font-black uppercase text-xs tracking-widest transition-all"><X size={20} /> Fermer</button>
          <button onClick={() => window.print()} className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-primary-600/30 flex items-center gap-2 uppercase tracking-widest text-xs"><Printer size={20} /> Imprimer</button>
        </div>
        <div className="overflow-auto rounded-[3rem] shadow-2xl">
          <AnnualReportView year={showReport.year} products={products} movements={movements} type={showReport.type} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row gap-4 bg-card p-6 rounded-[2.5rem] shadow-premium  border border-card-border">
          <button onClick={() => setShowReport({ year: new Date().getFullYear(), type: 'materiel' })} className="flex-1 bg-white bg-primary-50 text-primary-600 border-2 border-primary-100 border-primary-100 p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-50 transition-all flex items-center justify-center gap-3"><FileText size={20} /> Rapport Matériel</button>
          <button onClick={() => setShowReport({ year: new Date().getFullYear(), type: 'cafe' })} className="flex-1 bg-white bg-primary-50 text-primary-600 border-2 border-primary-100 border-primary-100 p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-50 transition-all flex items-center justify-center gap-3"><FileText size={20} /> Rapport Café</button>
        </div>

        <div className="glass-card overflow-hidden border-none shadow-premium">
          <div className="p-8 bg-card bg-white flex items-center gap-3">
            <Clock size={24} className="text-primary-400 " />
            <h3 className="text-xl font-black text-foreground text-foreground uppercase tracking-tight">Journal des Flux</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 bg-primary-50 bg-primary-50/50">
                  <th className="px-8 py-5">Date & Heure</th>
                  <th className="px-8 py-5">Désignation</th>
                  <th className="px-8 py-5">Flux</th>
                  <th className="px-8 py-5 text-right">Quantité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 divide-primary-100">
                {movements.map((m, i) => {
                   const product = products.find(p => p.id?.toString() === (m.productId || (m as any).product_id)?.toString());
                   return (
                     <tr key={i} className="hover:bg-primary-50/30 hover:bg-primary-50/30 transition-colors group">
                       <td className="px-8 py-5">
                          <div className="text-xs font-black text-foreground  uppercase tracking-tighter">{new Date(m.date).toLocaleDateString('fr-FR')}</div>
                          <div className="text-[10px] font-bold text-primary-500 font-mono mt-1">{new Date(m.date).toLocaleTimeString('fr-FR')}</div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="font-black text-sm text-foreground  uppercase leading-tight">{product?.designation || 'Inconnu'}</div>
                          <div className="text-[9px] font-bold text-primary-400 uppercase tracking-widest mt-1">{product?.type}</div>
                       </td>
                       <td className="px-8 py-5">
                          <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border", m.type === 'ENTREE' ? "bg-primary-600/10 text-primary-600 border-primary-500/20" : "bg-primary-600/10 text-primary-600 border-primary-500/20")}>{m.type}</span>
                       </td>
                       <td className="px-8 py-5 text-right font-black text-base text-foreground font-mono">
                          <span className={cn(
                            "px-2 py-1 rounded-lg",
                            m.type === 'ENTREE' ? "text-primary-600 bg-primary-50" : "text-orange-600 bg-orange-50"
                          )}>
                            {m.type === 'ENTREE' ? '+' : '-'}{parseFloat(m.quantite.toString()).toFixed(2)}
                          </span>
                       </td>
                     </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
