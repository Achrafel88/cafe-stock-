'use client';

import React from 'react';
import { Sale, IDENTITIES } from '@/types';
import { formatCurrency, formatDate, numberToFrenchWords } from '@/utils/format';
import { useData } from '@/context/DataContext';

export default function InvoiceView({ sale }: { sale: Sale }) {
  const { clients } = useData();
  // Robust lookup using string comparison
  const client = clients.find(c => c.id?.toString() === sale.clientId?.toString());
  const identity = IDENTITIES[sale.type_vente];

  return (
    <div className="bg-white text-black min-h-[1000px] p-4 md:p-10 font-sans max-w-[850px] mx-auto print:m-0 print:p-6 print:min-h-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-8 border-b-2 border-black pb-4 gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-black uppercase leading-tight mb-1">{identity.header}</h1>
          <p className="text-[11px] md:text-sm font-bold uppercase mb-2">{identity.subtitle}</p>
          <p className="text-[11px] md:text-sm">Tél: <span className="font-bold">{identity.tel}</span></p>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end">
          <div className="bg-black text-white px-4 py-2 font-black text-lg md:text-xl mb-4">
            FACTURE N° : {sale.numero_facture}
          </div>
          <div className="text-[11px] md:text-sm space-y-0.5">
            <p>Date Facture : <span className="font-bold">{formatDate(sale.date_facture)}</span></p>
            <p>N° Client : <span className="font-bold">{client?.id?.toString().padStart(5, '0')}</span></p>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
        <div className="border border-black p-3 rounded-sm relative">
          <h3 className="text-[9px] font-black uppercase bg-black text-white px-2 py-0.5 inline-block mb-2">DESTINATAIRE</h3>
          <p className="font-black text-base md:text-lg uppercase leading-tight">{client?.nom}</p>
          <p className="text-[11px] md:text-sm mt-1 whitespace-pre-wrap leading-tight">{client?.adresse}</p>
          <div className="mt-3 pt-1.5 border-t border-dashed border-gray-300">
            <p className="text-[9px] font-bold uppercase text-gray-500">ICE Client</p>
            <p className="text-sm md:text-base font-black tracking-wider">{client?.ice || 'N/A'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] md:text-xs">
          <div className="border border-black p-2">
            <p className="font-bold text-gray-500 mb-0.5 uppercase">Mode Paiement</p>
            <p className="font-black uppercase">{sale.mode_paiement}</p>
          </div>
          <div className="border border-black p-2">
            <p className="font-bold text-gray-500 mb-0.5 uppercase">Mode Livraison</p>
            <p className="font-black uppercase">{sale.mode_livraison || '-'}</p>
          </div>
          <div className="border border-black p-2 col-span-2">
            <p className="font-bold text-gray-500 mb-0.5 uppercase">Note / Observation</p>
            <p className="font-medium italic line-clamp-1 text-[10px]">{sale.note || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border-2 border-black min-w-[500px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-2 border-black px-3 py-1 text-left uppercase text-[10px] md:text-xs font-black">Désignation</th>
              <th className="border-2 border-black px-3 py-1 text-center uppercase text-[10px] md:text-xs font-black w-16">Qté</th>
              <th className="border-2 border-black px-3 py-1 text-right uppercase text-[10px] md:text-xs font-black w-24">Prix U.</th>
              <th className="border-2 border-black px-3 py-1 text-right uppercase text-[10px] md:text-xs font-black w-28">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} className="border-2 border-black">
                <td className="border-2 border-black px-3 py-1.5 text-xs md:text-sm font-bold uppercase">{item.designation}</td>
                <td className="border-2 border-black px-3 py-2 text-center text-xs md:text-sm font-bold">{item.quantite}</td>
                <td className="border-2 border-black px-3 py-2 text-right text-xs md:text-sm font-mono">{formatCurrency(item.prix_unitaire_ttc)}</td>
                <td className="border-2 border-black px-3 py-2 text-right text-xs md:text-sm font-black font-mono">{formatCurrency(item.total_ttc)}</td>
              </tr>
            ))}
            {[...Array(Math.max(0, 3 - sale.items.length))].map((_, i) => (
              <tr key={`empty-${i}`} className="border-2 border-black h-8">
                <td className="border-2 border-black px-3 py-1.5"></td>
                <td className="border-2 border-black px-3 py-1.5"></td>
                <td className="border-2 border-black px-3 py-1.5"></td>
                <td className="border-2 border-black px-3 py-1.5"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex-1 w-full pr-0 md:pr-4">
          <p className="text-[9px] uppercase font-black mb-1 underline text-gray-500">Arrêtée la présente a la somme TTC :</p>
          <p className="text-xs md:text-sm font-black uppercase leading-tight italic bg-gray-50 p-3 border border-dashed border-gray-400">
            {numberToFrenchWords(sale.total_ttc)}
          </p>
          <div className="mt-4 text-center md:text-left md:w-64">
            <p className="text-[9px] font-black uppercase underline mb-4">Signature & Cachet</p>
            <div className="h-10 md:h-14"></div>
          </div>
        </div>
        <div className="w-full md:w-56 space-y-0 text-[10px] md:text-xs">
          <div className="flex justify-between border-2 border-black border-b-0 p-1.5">
            <span className="font-black uppercase">TOTAL HT</span>
            <span className="font-mono">{formatCurrency(sale.total_ht)}</span>
          </div>
          <div className="flex justify-between border-2 border-black border-b-0 p-1.5">
            <span className="font-black uppercase">TVA (20%)</span>
            <span className="font-mono">{formatCurrency(sale.total_tva)}</span>
          </div>
          <div className="flex justify-between border-2 border-black bg-gray-100 p-2">
            <span className="font-black uppercase text-xs">TOTAL TTC</span>
            <span className="text-sm md:text-base font-black font-mono">{formatCurrency(sale.total_ttc)}</span>
          </div>
        </div>
      </div>

      {/* Business Footer */}
      <div className="mt-auto pt-4 border-t border-gray-300 text-[9px] text-gray-500 text-center leading-tight">
        <p className="font-bold text-black uppercase mb-1">{identity.footer}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {identity.patente && <span>Patente: <span className="font-bold text-black">{identity.patente}</span></span>}
          {identity.if && <span>IF: <span className="font-bold text-black">{identity.if}</span></span>}
          {identity.rc && <span>RC: <span className="font-bold text-black">{identity.rc}</span></span>}
          {identity.ice && <span>ICE: <span className="font-bold text-black">{identity.ice}</span></span>}
          {identity.pattNo && <span>Patt N°: <span className="font-bold text-black">{identity.pattNo}</span></span>}
          {identity.rcn && <span>R.C.N: <span className="font-bold text-black">{identity.rcn}</span></span>}
          {identity.lce && <span>L.C.E: <span className="font-bold text-black">{identity.lce}</span></span>}
        </div>
        {identity.rib && (
          <p className="mt-0.5 tracking-tighter">RIB: <span className="font-bold text-black">{identity.rib}</span></p>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { size: portrait; margin: 0; }
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; }
          section { padding: 0 !important; overflow: visible !important; }
          aside { display: none !important; }
          header { display: none !important; }
          .bg-slate-950 { background: white !important; }
          .max-w-5xl { max-width: none !important; }
          div { overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}
