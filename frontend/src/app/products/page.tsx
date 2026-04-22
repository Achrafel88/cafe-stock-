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
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-card p-6 rounded-[2.5rem] shadow-premium dark:shadow-premium-dark border border-card-border">
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
                  <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner", product.type === 'materiel' ? "bg-blue-500/10 text-blue-600" : "bg-orange-500/10 text-orange-600")}>
                    {product.type === 'materiel' ? <Package size={32} /> : <Layers size={32} />}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-foreground uppercase tracking-tight leading-tight mb-1">{product.designation}</h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">{product.type} • {product.unite}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-primary-50 dark:bg-slate-800/50 border border-primary-100 dark:border-slate-800">
                    <p className="text-[9px] font-black uppercase text-primary-400 mb-1 tracking-widest">Stock Disponible</p>
                    <p className={cn("text-xl font-black", isLowStock(product) ? "text-rose-600" : "text-foreground")}>{product.quantite_stock}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-800">
                    <p className="text-[9px] font-black uppercase text-indigo-400 mb-1 tracking-widest">Prix Unitaire</p>
                    <p className="text-xl font-black text-foreground">{product.prix_unitaire_ttc} <span className="text-[10px] opacity-40">DH</span></p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                   <button onClick={() => { setStockProduct(product); setIsStockModalOpen(true); }} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all">+ Stock</button>
                   <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20"><Edit2 size={18} /></button>
                   <button onClick={() => { if(confirm('Supprimer ?')) deleteProduct(product.id); }} className="p-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-500/20"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Shell>
  );
}
