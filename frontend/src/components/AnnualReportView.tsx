'use client';

import React from 'react';
import { Product, StockMovement, IDENTITIES, BusinessType } from '@/types';
import { formatDate } from '@/utils/format';

interface AnnualReportProps {
  year: number;
  products: Product[];
  movements: StockMovement[];
  type: BusinessType;
}

export default function AnnualReportView({ year, products, movements, type }: AnnualReportProps) {
  const identity = IDENTITIES[type];
  
  const reportData = products
    .filter(p => p.type === type)
    .map(product => {
      const productMovements = movements.filter(m => (m.productId || (m as any).product_id)?.toString() === product.id.toString());
      const yearMovements = productMovements.filter(m => new Date(m.date).getFullYear() === year);
      
      const totalIn = yearMovements
        .filter(m => m.type === 'ENTREE')
        .reduce((acc, m) => acc + Number(m.quantite), 0);
        
      const totalOut = yearMovements
        .filter(m => m.type === 'SORTIE')
        .reduce((acc, m) => acc + Number(m.quantite), 0);
      
      // Calcul du stock au 1er Janvier de l'année
      // Stock Initial = Stock Actuel - (Entrées de l'année - Sorties de l'année)
      const stockInitial = Number(product.quantite_stock) - (totalIn - totalOut);
        
      return {
        designation: product.designation.toUpperCase(),
        unite: product.unite,
        stockInitial,
        totalIn,
        totalOut,
        currentStock: product.quantite_stock
      };
    })
    .filter(d => d.totalIn > 0 || d.totalOut > 0 || d.stockInitial > 0);

  return (
    <div className="bg-white text-black min-h-screen p-4 md:p-8 font-sans max-w-[900px] mx-auto print:m-0 print:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-10 border-b-2 border-black pb-4 gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-black uppercase leading-tight mb-1">{identity.header}</h1>
          <p className="text-xs md:text-sm font-bold uppercase mb-2">{identity.subtitle}</p>
          <p className="text-xs md:text-sm">Tél: <span className="font-bold">{identity.tel}</span></p>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end">
          <div className="bg-black text-white px-4 py-2 font-black text-lg md:text-xl mb-4 uppercase">
            RAPPORT ANNUEL {year}
          </div>
          <div className="text-xs md:text-sm">
            <p>Date Génération : <span className="font-bold">{formatDate(new Date().toISOString())}</span></p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-center text-lg md:text-xl font-black uppercase border-2 border-black py-2 bg-gray-100 px-2">
          BILAN DES MOUVEMENTS - ANNÉE {year}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black mb-8 min-w-[600px]">
          <thead>
            <tr className="bg-gray-200 text-[9px] md:text-[10px]">
              <th className="border-2 border-black px-3 py-2 text-left uppercase font-black">Désignation Produit</th>
              <th className="border-2 border-black px-2 py-2 text-center uppercase font-black w-16">Unité</th>
              <th className="border-2 border-black px-2 py-2 text-right uppercase font-black w-24">Stock Initial</th>
              <th className="border-2 border-black px-2 py-2 text-right uppercase font-black w-24 bg-emerald-50">Entrées</th>
              <th className="border-2 border-black px-2 py-2 text-right uppercase font-black w-24 bg-rose-50">Sorties</th>
              <th className="border-2 border-black px-2 py-2 text-right uppercase font-black w-24">Stock Actuel</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, i) => (
              <tr key={i} className="border-2 border-black">
                <td className="border-2 border-black px-3 py-2 text-xs md:text-sm font-bold uppercase">{item.designation}</td>
                <td className="border-2 border-black px-2 py-2 text-center text-[9px] md:text-[10px] font-black uppercase">{item.unite}</td>
                <td className="border-2 border-black px-2 py-2 text-right text-xs md:text-sm font-mono">{item.stockInitial}</td>
                <td className="border-2 border-black px-2 py-2 text-right text-xs md:text-sm font-black font-mono text-emerald-600 bg-emerald-50/30">{item.totalIn}</td>
                <td className="border-2 border-black px-2 py-2 text-right text-xs md:text-sm font-black font-mono text-rose-600 bg-rose-50/30">{item.totalOut}</td>
                <td className="border-2 border-black px-2 py-2 text-right text-xs md:text-sm font-black font-mono bg-gray-50">{item.currentStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-xs md:text-sm">
        <div className="border border-black p-4">
          <p className="font-black uppercase underline mb-2">Résumé du Rapport</p>
          <div className="space-y-1 font-bold">
            <p>Total des produits: <span className="float-right">{reportData.length}</span></p>
            <p>Somme des entrées: <span className="float-right text-emerald-600">{reportData.reduce((acc, d) => acc + d.totalIn, 0)}</span></p>
            <p>Somme des sorties: <span className="float-right text-rose-600">{reportData.reduce((acc, d) => acc + d.totalOut, 0)}</span></p>
          </div>
        </div>
        <div className="text-center flex flex-col justify-center border border-black p-4 min-h-[100px]">
          <p className="text-[9px] md:text-[10px] font-black uppercase underline mb-6">Signature & Cachet</p>
        </div>
      </div>

      {/* Business Footer */}
      <div className="mt-auto pt-10 border-t border-gray-300 text-[10px] text-gray-500 text-center leading-relaxed">
        <p className="font-bold text-black uppercase mb-1">{identity.footer}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          {identity.patente && <span>Patente: <span className="font-bold text-black">{identity.patente}</span></span>}
          {identity.if && <span>IF: <span className="font-bold text-black">{identity.if}</span></span>}
          {identity.rc && <span>RC: <span className="font-bold text-black">{identity.rc}</span></span>}
          {identity.ice && <span>ICE: <span className="font-bold text-black">{identity.ice}</span></span>}
          {identity.pattNo && <span>Patt N°: <span className="font-bold text-black">{identity.pattNo}</span></span>}
          {identity.rcn && <span>R.C.N: <span className="font-bold text-black">{identity.rcn}</span></span>}
          {identity.lce && <span>L.C.E: <span className="font-bold text-black">{identity.lce}</span></span>}
        </div>
        {identity.rib && (
          <p className="mt-1">RIB: <span className="font-bold text-black">{identity.rib}</span></p>
        )}
      </div>
    </div>
  );
}
