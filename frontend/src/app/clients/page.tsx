'use client';

import React, { useState } from 'react';
import Shell from '@/components/Shell';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/utils/format';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Phone, 
  MapPin, 
  Hash,
  Calendar,
  X,
  User,
  Save,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Client } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telephone.includes(searchTerm)
  );

  const handleSaveClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nom: formData.get('nom') as string,
      adresse: formData.get('adresse') as string,
      telephone: formData.get('telephone') as string,
      ice: formData.get('ice') as string,
    };

    if (editingClient) {
      await updateClient(editingClient.id, data);
    } else {
      await addClient(data);
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <Shell>
      <div className="space-y-8">
        {/* Header/Controls */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6 justify-between items-center"
        >
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, ICE ou tel..." 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-600/20 outline-none font-medium text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-primary-600/20 transition-all active:scale-95 font-black text-sm uppercase tracking-widest"
          >
            <UserPlus size={20} /> Nouveau Client
          </button>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client) => (
              <motion.div
                layout
                key={client.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 md:p-8 group relative flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-600 font-black text-2xl shadow-inner">
                    {client.nom.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingClient(client); setIsModalOpen(true); }}
                      className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Supprimer ce client ?')) deleteClient(client.id); }}
                      className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-black tracking-tight mb-6 line-clamp-1">{client.nom}</h3>
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50/50 dark:bg-slate-800/50 border border-primary-100/30">
                    <Hash size={18} className="text-primary-600" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-primary-400 tracking-widest">ICE Identifiant</p>
                      <p className="text-sm font-black font-mono tracking-tight text-slate-700 dark:text-slate-200">{client.ice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100/30">
                    <Phone size={18} className="text-indigo-600" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Téléphone</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{client.telephone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100/30">
                    <MapPin size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Adresse</p>
                      <p className="text-xs font-medium leading-relaxed line-clamp-2 text-slate-700 dark:text-slate-200">{client.adresse}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{formatDate(client.date_creation)}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredClients.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-6">
              <User size={48} />
            </div>
            <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">Aucun client trouvé dans la base.</p>
          </div>
        )}

        {/* Client Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="glass-card w-full max-w-lg z-50 overflow-hidden"
              >
                <div className="p-8 border-b border-[var(--card-border)] bg-primary-600 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      {editingClient ? 'Modifier Client' : 'Nouveau Client'}
                    </h3>
                    <p className="text-primary-100 text-[10px] font-black mt-1 uppercase tracking-widest">Base de données clients</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSaveClient} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom / Raison Sociale</label>
                    <input 
                      name="nom" 
                      defaultValue={editingClient?.nom} 
                      required 
                      autoFocus
                      className="input-field font-black text-lg text-[var(--foreground)]"
                      placeholder="Ex: Café La Renaissance SARL"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ICE</label>
                      <input 
                        name="ice" 
                        defaultValue={editingClient?.ice} 
                        required 
                        className="input-field font-black text-[var(--foreground)] font-mono"
                        placeholder="00XXXXXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label>
                      <input 
                        name="telephone" 
                        defaultValue={editingClient?.telephone} 
                        required 
                        className="input-field font-black text-[var(--foreground)]"
                        placeholder="06XXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adresse Complète</label>
                    <textarea 
                      name="adresse" 
                      defaultValue={editingClient?.adresse} 
                      rows={3}
                      required 
                      className="input-field font-medium text-[var(--foreground)] resize-none"
                      placeholder="Rue, Quartier, Ville..."
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-4 rounded-2xl border border-[var(--card-border)] font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase text-xs tracking-widest"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                    >
                      <Save size={18} /> Enregistrer
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
}
