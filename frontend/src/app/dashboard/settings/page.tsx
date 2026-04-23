'use client';

import React, { useState, useEffect } from 'react';
import Shell from '@/components/Shell';
import { User, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.username);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/admin/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password: password || undefined,
          userId: user?.id
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        // Update local storage
        const updatedUser = { ...user, username };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Une erreur est survenue' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground ">Paramètres du Compte</h2>
          <p className="text-primary-600 font-bold uppercase text-[10px] tracking-[0.2em]">Gérez vos informations d'identification admin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-primary-600/20">
                <User size={48} />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tighter">{user?.username || 'Admin'}</h3>
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mt-1">Administrateur Principal</p>
            </div>
            
            <div className="glass-card p-6 border-l-4 border-primary-600 bg-primary-50/50 dark:bg-primary-600/5">
              <div className="flex gap-4">
                <AlertCircle className="text-primary-600 shrink-0" size={20} />
                <p className="text-xs font-bold text-primary-800 dark:text-primary-300 leading-relaxed">
                  Laissez le champ du mot de passe vide si vous ne souhaitez pas le modifier.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleUpdate} className="glass-card p-8 md:p-10 space-y-8">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 ${
                    message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                    : 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-black uppercase tracking-tight">{message.text}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 ml-4">Nom d'utilisateur</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-800 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all text-foreground"
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 ml-4">Nouveau mot de passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-800 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all text-foreground"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 ml-4">Confirmer le mot de passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-800 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all text-foreground"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.25em] text-xs transition-all shadow-xl shadow-primary-600/30 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? 'Mise à jour...' : <><Save size={18} /> Enregistrer les modifications</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
