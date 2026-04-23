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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, ICE ou tel..." 
              className="w-full pl-12 pr-4 py-3 bg-white bg-primary-100 border border-primary-200 border-primary-100 rounded-2xl focus:ring-2 focus:ring-primary-600/20 outline-none font-medium text-sm transition-all"
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
                <div className="flex justify-between items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-900 font-black text-lg shadow-sm">
                    {client.nom.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setEditingClient(client); setIsModalOpen(true); }}
                      className="p-2 bg-primary-50 text-primary-900 rounded-xl hover:bg-primary-100 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Supprimer ce client ?')) deleteClient(client.id); }}
                      className="p-2 bg-primary-50 text-rose-800 rounded-xl hover:bg-rose-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-base font-black text-foreground mb-4 line-clamp-1">{client.nom}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-primary-50 p-2.5 rounded-xl border border-primary-100">
                      <span className="text-[9px] font-black uppercase text-primary-700 block mb-0.5">ICE</span>
                      <span className="text-xs font-black font-mono text-foreground">{client.ice}</span>
                    </div>
                    <div className="bg-primary-50 p-2.5 rounded-xl border border-primary-100">
                      <span className="text-[9px] font-black uppercase text-primary-700 block mb-0.5">TÉL</span>
                      <span className="text-xs font-black text-foreground">{client.telephone}</span>
                    </div>
                  </div>
                  <div className="bg-primary-50 p-2.5 rounded-xl mt-2 border border-primary-100">
                    <span className="text-[9px] font-black uppercase text-primary-700 block mb-0.5">ADRESSE</span>
                    <span className="text-xs font-medium text-foreground line-clamp-1">{client.adresse}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredClients.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary-100  flex items-center justify-center text-primary-300 mb-6">
              <User size={48} />
            </div>
            <p className="text-primary-400 font-black italic uppercase tracking-widest text-xs">Aucun client trouvé dans la base.</p>
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
                className="absolute inset-0 bg-primary-950/60 backdrop-blur-md"
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-400">Nom / Raison Sociale</label>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary-400">ICE</label>
                      <input 
                        name="ice" 
                        defaultValue={editingClient?.ice} 
                        required 
                        className="input-field font-black text-[var(--foreground)] font-mono"
                        placeholder="00XXXXXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary-400">Téléphone</label>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-400">Adresse Complète</label>
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
                      className="flex-1 px-8 py-4 rounded-2xl border border-[var(--card-border)] font-bold text-primary-500 hover:bg-primary-50  transition-colors uppercase text-xs tracking-widest"
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
