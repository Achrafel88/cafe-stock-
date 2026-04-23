'use client';

import React, { useState, useEffect } from 'react';
import Shell from '@/components/Shell';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatDate, numberToFrenchWords } from '@/utils/format';
import { 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  Printer, 
  ChevronLeft,
  Search,
  AlertCircle,
  FileText,
  CreditCard,
  Truck,
  StickyNote,
  User,
  Hash,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sale, SaleItem, BusinessType, PaymentMode, SaleStatus, IDENTITIES } from '@/types';
import InvoiceView from '@/components/InvoiceView';
import { motion, AnimatePresence } from 'framer-motion';

export default function SalesPage() {
  const { clients, products, sales, addSale, validateSale, deleteSale } = useData();
  const [view, setView] = useState<'list' | 'form' | 'print'>('list');
  const [currentSale, setCurrentSale] = useState<Partial<Sale> | null>(null);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const startNewSale = () => {
    setCurrentSale({
      numero_facture: '',
      clientId: '',
      type_vente: 'materiel',
      date_facture: new Date().toISOString().split('T')[0],
      mode_paiement: 'ESPECE',
      mode_livraison: '',
      note: '',
      items: [],
      total_ttc: 0,
      total_ht: 0,
      total_tva: 0,
    });
    setView('form');
  };

  const handleAddItem = () => {
    if (!currentSale) return;
    const newItems = [
      ...(currentSale.items || []),
      { productId: '', designation: '', quantite: 1, prix_unitaire_ttc: 0, total_ttc: 0 }
    ];
    updateSaleItems(newItems);
  };

  const removeItem = (index: number) => {
    if (!currentSale || !currentSale.items) return;
    const newItems = currentSale.items.filter((_, i) => i !== index);
    updateSaleItems(newItems);
  };

  const updateItem = (index: number, updates: Partial<SaleItem>) => {
    if (!currentSale || !currentSale.items) return;
    const newItems = [...currentSale.items];
    const item = { ...newItems[index], ...updates };
    
    if (updates.productId) {
      const product = products.find(p => p.id.toString() === updates.productId);
      if (product) {
        item.designation = product.designation;
        item.prix_unitaire_ttc = product.prix_unitaire_ttc;
      }
    }
    
    item.total_ttc = item.quantite * item.prix_unitaire_ttc;
    newItems[index] = item;
    updateSaleItems(newItems);
  };

  const updateSaleItems = (items: SaleItem[]) => {
    const total_ttc = items.reduce((acc, item) => acc + item.total_ttc, 0);
    const total_ht = total_ttc / 1.20;
    const total_tva = total_ht * 0.20;
    
    setCurrentSale(prev => ({
      ...prev,
      items,
      total_ttc,
      total_ht,
      total_tva
    }));
  };

  const handleSave = async () => {
    console.log("DEBUG: Saving sale, currentSale:", currentSale);
    
    // Ensure clientId is present and correctly typed
    const clientId = currentSale?.clientId ? parseInt(currentSale.clientId.toString()) : null;

    if (!currentSale || !clientId || !currentSale.numero_facture || (currentSale.items?.length || 0) === 0) {
      alert(`Veuillez remplir tous les champs obligatoires (Client sélectionné: ${currentSale?.clientId})`);
      return;
    }

    // Send the sale with the validated clientId
    await addSale({ ...currentSale, clientId: clientId.toString() } as Omit<Sale, 'id' | 'status'>);
    setView('list');
    setCurrentSale(null);
  };

  const handlePrint = (saleId: string) => {
    setSelectedSaleId(saleId);
    setView('print');
  };

  useEffect(() => {
    if (view === 'print') {
      const timer = setTimeout(() => {
        window.print();
        setView('list');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  if (view === 'print' && selectedSaleId) {
    const sale = sales.find(s => s.id.toString() === selectedSaleId.toString());
    if (!sale) return null;
    return <InvoiceView sale={{...sale, items: sale.items || []}} />;
  }

  return (
    <Shell>
      <div className="space-y-8">
        {view === 'list' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--sidebar)] p-4 md:p-6 rounded-3xl border border-[var(--card-border)] shadow-premium gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground ">Ventes & Facturation</h2>
                <p className="text-[10px] font-bold text-primary-500  mt-1 uppercase tracking-widest">Historique et gestion des factures</p>
              </div>
              <button 
                onClick={startNewSale}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-primary-600/20 transition-all active:scale-95"
              >
                <Plus size={20} /> Nouvelle Vente
              </button>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-primary-50 bg-primary-50 text-primary-500  text-[10px] uppercase font-black tracking-widest border-b border-[var(--card-border)]">
                      <th className="px-4 md:px-8 py-5">Facture N°</th>
                      <th className="px-4 md:px-8 py-5">Client</th>
                      <th className="px-4 md:px-8 py-5">Date</th>
                      <th className="px-4 md:px-8 py-5">Type</th>
                      <th className="px-4 md:px-8 py-5 text-right">Montant TTC</th>
                      <th className="px-4 md:px-8 py-5 text-center">État</th>
                      <th className="px-4 md:px-8 py-5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)]">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-primary-50 hover:bg-primary-50 transition-colors group">
                        <td className="px-4 md:px-8 py-5">
                          <span className="font-black text-sm font-mono text-primary-600 ">{sale.numero_facture}</span>
                        </td>
                        <td className="px-4 md:px-8 py-5">
                          <div className="font-bold text-sm truncate max-w-[150px] text-foreground ">
                            {sale.client_nom || 'Client Inconnu'}
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-5 text-primary-500  text-[10px] md:text-xs font-bold uppercase">{formatDate(sale.date_facture)}</td>
                        <td className="px-4 md:px-8 py-5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border whitespace-nowrap",
                            sale.type_vente === 'materiel' 
                              ? "bg-primary-500/10 text-primary-600 border-primary-500/20" 
                              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                          )}>
                            {sale.type_vente}
                          </span>
                        </td>
                        <td className="px-4 md:px-8 py-5 text-right">
                          <span className="font-black text-sm whitespace-nowrap">{formatCurrency(sale.total_ttc)}</span>
                        </td>
                        <td className="px-4 md:px-8 py-5 text-center">
                          <span className={cn(
                            "px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tight whitespace-nowrap",
                            sale.status === 'VALIDATED' 
                              ? "bg-primary-600 text-white" 
                              : "bg-primary-200 bg-primary-200 text-primary-500 "
                          )}>
                            {sale.status === 'VALIDATED' ? 'Validée' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="px-4 md:px-8 py-5">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handlePrint(sale.id)}
                              className="p-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95"                              title="Imprimer"
                            >
                              <Printer size={16} />
                            </button>
                            {sale.status === 'DRAFT' && (
                              <button 
                                onClick={() => { if(confirm('Valider ? Stock sera déduit.')) validateSale(sale.id); }}
                                className="p-2.5 bg-primary-600 hover:bg-primary-600 text-white rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
                                title="Valider"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => { if(confirm('Supprimer ?')) deleteSale(sale.id); }}
                              className="p-2.5 bg-primary-600 hover:bg-primary-600 text-white rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'form' && currentSale && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-7xl mx-auto space-y-4 md:space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <button onClick={() => setView('list')} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[var(--sidebar)] border border-[var(--card-border)] rounded-xl md:rounded-2xl hover:bg-primary-50 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Nouvelle Vente</h2>
              </div>
              
              <div className="bg-primary-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg flex justify-between items-center md:flex-col md:items-end gap-2">
                <span className="text-[9px] md:text-[10px] font-black uppercase opacity-60">Total TTC</span>
                <span className="text-lg md:text-2xl font-black font-mono">{formatCurrency(currentSale.total_ttc || 0)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-8">
              <div className="xl:col-span-4 space-y-4 md:space-y-6">
                <div className="glass-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 text-primary-600 mb-2">
                    <FileText size={20} />
                    <h3 className="font-black uppercase tracking-wider text-sm">Paramètres</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-400">Type de Commerce</label>
                    <div className="grid grid-cols-2 bg-primary-100 bg-primary-50 p-1.5 rounded-2xl">
                      <button 
                        onClick={() => setCurrentSale({...currentSale, type_vente: 'materiel', items: []})}
                        className={cn(
                          "py-2.5 rounded-xl text-[10px] font-black transition-all",
                          currentSale.type_vente === 'materiel' ? "bg-primary-600 text-white shadow-lg" : "text-primary-500"
                        )}
                      >
                        MATÉRIEL
                      </button>
                      <button 
                        onClick={() => setCurrentSale({...currentSale, type_vente: 'cafe', items: []})}
                        className={cn(
                          "py-2.5 rounded-xl text-[10px] font-black transition-all",
                          currentSale.type_vente === 'cafe' ? "bg-primary-600 text-white shadow-lg" : "text-primary-500"
                        )}
                      >
                        CAFÉ
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                      <User size={12} /> Client
                    </label>
                    <select 
                      className="input-field font-bold text-xs md:text-sm py-3"
                      value={currentSale.clientId || ''}
                      onChange={(e) => setCurrentSale(prev => ({ ...prev!, clientId: e.target.value }))}
                    >
                      <option value="">Sélectionner un client...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                      <Hash size={12} /> N° Facture
                    </label>
                    <input 
                      type="text" 
                      placeholder="F2026-..." 
                      className="input-field font-black font-mono text-sm"
                      value={currentSale.numero_facture}
                      onChange={(e) => setCurrentSale({...currentSale, numero_facture: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary-400">Date</label>
                      <input 
                        type="date" 
                        className="input-field text-xs font-bold"
                        value={currentSale.date_facture}
                        onChange={(e) => setCurrentSale({...currentSale, date_facture: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                        <CreditCard size={12} /> Paiement
                      </label>
                      <select 
                        className="input-field text-xs font-bold"
                        value={currentSale.mode_paiement}
                        onChange={(e) => setCurrentSale({...currentSale, mode_paiement: e.target.value as PaymentMode})}
                      >
                        <option value="ESPECE">Espèce</option>
                        <option value="CHEQUE">Chèque</option>
                        <option value="VIREMENT">Virement</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 bg-primary-600 text-white shadow-xl">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs opacity-60 font-bold uppercase">
                      <span>Total HT</span>
                      <span>{formatCurrency(currentSale.total_ht || 0)}</span>
                    </div>
                    <div className="pt-3 border-t border-white/20">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Montant en lettres</p>
                      <p className="text-xs font-bold leading-relaxed italic">
                        {currentSale.total_ttc ? numberToFrenchWords(currentSale.total_ttc) : "Zéro dirhams"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSave}
                    className="w-full mt-6 bg-white text-primary-600 font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs"
                  >
                    Valider le Brouillon
                  </button>
                </div>
              </div>

              <div className="xl:col-span-8 flex flex-col gap-6">
                <div className="glass-card flex-1 flex flex-col min-h-[400px]">
                  <div className="p-4 md:p-6 border-b border-[var(--card-border)] flex justify-between items-center bg-primary-50 bg-primary-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary-600 flex items-center justify-center text-foreground">
                        <Plus size={18} />
                      </div>
                      <h3 className="font-black uppercase tracking-wider text-xs md:text-sm">Lignes</h3>
                    </div>
                    <button 
                      onClick={handleAddItem}
                      className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 underline"
                    >
                      Ajouter une ligne
                    </button>
                  </div>

                  <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-[10px] uppercase font-black tracking-widest text-primary-400 border-b border-[var(--card-border)]">
                          <th className="px-6 py-4 text-left">Produit</th>
                          <th className="px-6 py-4 text-center w-24">Quantité</th>
                          <th className="px-6 py-4 text-right w-32">P.U</th>
                          <th className="px-6 py-4 text-right w-32">Total</th>
                          <th className="px-6 py-4 text-center w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)]">
                        {currentSale.items?.map((item, index) => (
                          <tr key={index} className="group hover:bg-primary-50 hover:bg-primary-50">
                            <td className="px-6 py-4">
                              <select 
                                className="w-full bg-transparent border-none font-bold text-xs md:text-sm focus:ring-0 outline-none truncate max-w-[200px]"
                                value={item.productId}
                                onChange={(e) => updateItem(index, { productId: e.target.value })}
                              >
                                <option value="">Choisir...</option>
                                {products
                                  .filter(p => p.type === currentSale.type_vente)
                                  .map(p => (
                                    <option key={p.id} value={p.id}>{p.designation}</option>
                                  ))
                                }
                              </select>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <input 
                                type="number" 
                                className="w-16 bg-primary-100 bg-primary-50 border-none rounded-lg text-center font-black py-2 text-xs md:text-sm outline-none"
                                value={item.quantite}
                                onChange={(e) => updateItem(index, { quantite: parseFloat(e.target.value) || 0 })}
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <input 
                                type="number" 
                                className="w-24 bg-transparent border-none text-right font-black text-xs md:text-sm outline-none"
                                value={item.prix_unitaire_ttc}
                                onChange={(e) => updateItem(index, { prix_unitaire_ttc: parseFloat(e.target.value) || 0 })}
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-black text-xs md:text-sm text-primary-600 whitespace-nowrap">{formatCurrency(item.total_ttc)}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button onClick={() => removeItem(index)} className="text-primary-400 hover:text-primary-600 p-2">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Shell>
  );
}
