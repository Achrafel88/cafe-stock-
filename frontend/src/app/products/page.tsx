'use client';

import React, { useState } from 'react';
import Shell from '@/components/Shell';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/format';
import { 
  Plus, Search, Edit2, Trash2, PackagePlus, AlertCircle, X, Package, Layers, Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, BusinessType, Unite } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, addStock, isLowStock } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<BusinessType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      designation: formData.get('designation') as string,
      type: formData.get('type') as BusinessType,
      unite: formData.get('unite') as Unite,
      prix_unitaire_ttc: parseFloat(formData.get('prix_unitaire_ttc') as string),
      quantite_stock: parseFloat(formData.get('quantite_stock') as string),
      seuil_alerte: parseFloat(formData.get('seuil_alerte') as string),
    };
    if (editingProduct) await updateProduct(editingProduct.id, data);
    else await addProduct(data);
    setIsModalOpen(false); setEditingProduct(null);
  };

  return (
    <Shell>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-card p-6 rounded-[2.5rem] shadow-premium  border border-card-border">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
            <input 
              type="text" placeholder="Rechercher..." 
              className="w-full pl-12 pr-4 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-foreground"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                <Plus size={20} /> Nouveau Produit
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 group relative flex flex-col h-full border-none">
                <div className="flex items-start gap-5 mb-8">
                  <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner", product.type === 'materiel' ? "bg-primary-500/10 text-primary-600" : "bg-orange-500/10 text-orange-600")}>
                    {product.type === 'materiel' ? <Package size={32} /> : <Layers size={32} />}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-foreground  uppercase tracking-tight leading-tight mb-1">{product.designation}</h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 ">{product.type} • {product.unite}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-primary-100 bg-primary-100 border border-primary-200 border-primary-200">
                    <p className="text-[9px] font-black uppercase text-primary-500  mb-1 tracking-widest">Stock Disponible</p>
                    <p className={cn("text-xl font-black", isLowStock(product) ? "text-primary-600" : "text-foreground ")}>{product.quantite_stock}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary-100 bg-primary-100 border border-primary-200 border-primary-200">
                    <p className="text-[9px] font-black uppercase text-primary-500  mb-1 tracking-widest">Prix Unitaire</p>
                    <p className="text-xl font-black text-foreground ">{product.prix_unitaire_ttc} <span className="text-[10px] opacity-40">DH</span></p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                   <button onClick={() => { setStockProduct(product); setIsStockModalOpen(true); }} className="flex-1 bg-primary-600 hover:bg-primary-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-600/20 transition-all">+ Stock</button>
                   <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/20"><Edit2 size={18} /></button>
                   <button onClick={() => { if(confirm('Supprimer ?')) deleteProduct(product.id); }} className="p-4 bg-primary-600 hover:bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-600/20"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={handleSaveProduct} className="bg-card p-8 rounded-3xl w-full max-w-lg border border-card-border shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase text-foreground">{editingProduct ? 'Modifier' : 'Nouveau'} Produit</h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-primary-500 hover:text-foreground"><X size={24} /></button>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-[11px] font-black uppercase text-primary-600  mb-1.5 block">Désignation</label>
                    <input name="designation" defaultValue={editingProduct?.designation} placeholder="Ex: Café Arabica" className="input-field border-primary-100 border-primary-200 focus:border-primary-500" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black uppercase text-primary-600  mb-1.5 block">Type</label>
                      <select name="type" defaultValue={editingProduct?.type || 'materiel'} className="input-field border-primary-100 border-primary-200">
                        <option value="materiel">Matériel</option>
                        <option value="cafe">Café</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase text-primary-600  mb-1.5 block">Unité</label>
                      <select name="unite" defaultValue={editingProduct?.unite || 'unité'} className="input-field border-primary-100 border-primary-200">
                        <option value="unité">Unité</option>
                        <option value="kg">Kg</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-primary-600  mb-1.5 block">Prix Unitaire TTC (DH)</label>
                    <input name="prix_unitaire_ttc" type="number" step="0.01" defaultValue={editingProduct?.prix_unitaire_ttc} placeholder="0.00" className="input-field border-primary-100 border-primary-200" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black uppercase text-primary-600  mb-1.5 block">Stock Initial</label>
                      <input name="quantite_stock" type="number" step="0.01" defaultValue={editingProduct?.quantite_stock || 0} placeholder="0" className="input-field border-primary-100 border-primary-200" required />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase text-primary-600  mb-1.5 block">Seuil Alerte</label>
                      <input name="seuil_alerte" type="number" step="0.01" defaultValue={editingProduct?.seuil_alerte || 5} placeholder="5" className="input-field border-primary-100 border-primary-200" required />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary-600/20 uppercase tracking-widest text-xs mt-6 transition-all hover:scale-[1.02]">
                    Enregistrer le produit
                  </button>
                </div>
              </motion.form>
            </div>
          )}
          {isStockModalOpen && stockProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={async (e) => { e.preventDefault(); const qty = parseFloat(new FormData(e.currentTarget).get('qty') as string); await addStock(stockProduct.id, qty, 'Entrée manuelle'); setIsStockModalOpen(false); }} className="bg-card p-8 rounded-3xl w-full max-w-sm border border-card-border shadow-2xl">
                 <h2 className="text-xl font-black uppercase mb-6 text-foreground">Ajout Stock</h2>
                 <input name="qty" type="number" step="0.01" placeholder="Quantité à ajouter" className="input-field mb-4" required />
                 <button type="submit" className="w-full bg-primary-600 text-foreground font-black py-4 rounded-xl shadow-lg shadow-primary-600/30 uppercase tracking-widest text-xs">Confirmer</button>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
}
