'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  Coffee, 
  Settings, 
  ShieldCheck, 
  Package, 
  ChevronRight, 
  Star, 
  Truck, 
  Clock, 
  CheckCircle2,
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'cafe' | 'materiel'>('all');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('http://127.0.0.1:5001/api/public/products')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setProducts([
            { designation: 'Machine Espresso Pro 2G', type: 'materiel', prix_unitaire_ttc: 45000.00, premium: true },
            { designation: 'Moulin Automatique', type: 'materiel', prix_unitaire_ttc: 8500.00, premium: true },
            { designation: 'Café Arabica Excellence (1kg)', type: 'cafe', prix_unitaire_ttc: 180.00, premium: true },
            { designation: 'Café Robusta Intense (1kg)', type: 'cafe', prix_unitaire_ttc: 120.00, premium: false },
            { designation: 'Table Professionnelle', type: 'materiel', prix_unitaire_ttc: 50.00, premium: false },
            { designation: 'Sucre (Skar)', type: 'cafe', prix_unitaire_ttc: 1.00, premium: false },
          ]);
        } else {
          setProducts(data);
        }
      })
      .catch(() => {
        setProducts([
          { designation: 'Machine Espresso Pro 2G', type: 'materiel', prix_unitaire_ttc: 45000.00, premium: true },
          { designation: 'Moulin Automatique', type: 'materiel', prix_unitaire_ttc: 8500.00, premium: true },
          { designation: 'Café Arabica Excellence (1kg)', type: 'cafe', prix_unitaire_ttc: 180.00, premium: true },
          { designation: 'Café Robusta Intense (1kg)', type: 'cafe', prix_unitaire_ttc: 120.00, premium: false },
          { designation: 'Table Professionnelle', type: 'materiel', prix_unitaire_ttc: 50.00, premium: false },
          { designation: 'Sucre (Skar)', type: 'cafe', prix_unitaire_ttc: 1.00, premium: false },
        ]);
      });
  }, []);

  const filteredProducts = products.filter(p => activeTab === 'all' || p.type === activeTab);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-600 font-sans transition-colors duration-700 overflow-x-hidden">
      
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-emerald-500/5 blur-[80px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 p-6 flex justify-between items-center transition-all duration-300 bg-background/50 backdrop-blur-2xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-black text-2xl tracking-tighter flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary-600/20 rotate-3">C</div>
          <span className="text-foreground text-3xl">CAFE<span className="text-primary-500 underline decoration-indigo-500 underline-offset-4">STOCK</span></span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          {['Accueil', 'À Propos', 'Catalogue', 'Contact'].map((item, i) => (
            <a key={i} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-primary-500 transition-all hover:scale-110 active:scale-95">{item}</a>
          ))}
        </div>

        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-12 h-12 rounded-2xl bg-card border border-card-border flex items-center justify-center text-primary-500 shadow-premium hover:shadow-primary-500/20 transition-all active:scale-90"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-8 pt-20">
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-[11px] font-black uppercase tracking-[0.25em] mb-10">
              <Sparkles size={14} /> L'Art de l'espresso parfait
            </div>
            <h1 className="text-8xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-10 text-slate-900 dark:text-white">
              PURE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-500 to-primary-400">ENERGY.</span>
            </h1>
            <p className="max-w-lg text-slate-500 dark:text-slate-400 text-xl font-medium mb-12 leading-relaxed italic">
              "Plus qu'un fournisseur, nous sommes les bâtisseurs de votre expérience caféière."
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a href="#products" className="group relative px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Exploration <ChevronRight size={18} /></span>
                <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </a>
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-slate-200 dark:bg-slate-800" />)}
                <div className="pl-8 flex flex-col justify-center">
                  <span className="text-xs font-black uppercase text-primary-500">500+ Clients</span>
                  <span className="text-[10px] font-bold opacity-50 tracking-tighter">Satisfaits au Maroc</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative hidden lg:block"
          >
            <div className="w-full aspect-square rounded-[4rem] bg-gradient-to-tr from-primary-600/20 to-indigo-600/20 backdrop-blur-3xl border border-white/10 p-12 flex items-center justify-center group overflow-hidden">
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="relative z-10"
               >
                 <Coffee size={280} className="text-primary-600 dark:text-primary-400 drop-shadow-[0_20px_50px_rgba(92,108,235,0.3)]" />
               </motion.div>
               {/* Decorative floating icons */}
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0">
                  <Star className="absolute top-20 left-20 text-emerald-500/30" size={40} />
                  <Award className="absolute bottom-20 right-20 text-amber-500/30" size={50} />
                  <Zap className="absolute top-1/2 left-10 text-primary-500/30" size={30} />
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section - Integrated with Blobs */}
      <section className="px-8 py-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: 'LOGISTIQUE ELITE', val: '48H', desc: 'Livraison express nationale.' },
            { icon: ShieldCheck, title: 'MAINTENANCE PRO', val: '24/7', desc: 'Support technique dédié.' },
            { icon: Star, title: 'QUALITÉ SUPRÊME', val: '100%', desc: 'Grains d\'exception sourcés.' }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -15, scale: 1.02 }}
              className="p-10 rounded-[3.5rem] bg-card/30 backdrop-blur-xl border border-card-border hover:bg-primary-500/5 transition-all duration-500 group"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                <f.icon size={32} />
              </div>
              <h3 className="text-sm font-black mb-1 uppercase tracking-[0.3em] text-primary-500">{f.title}</h3>
              <p className="text-4xl font-black mb-4 tracking-tighter">{f.val}</p>
              <p className="text-slate-500 font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Catalog - Modern Grid */}
      <section id="catalogue" className="px-8 py-40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
            <div>
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-6">LA <br /> SÉLECTION.</h2>
              <p className="text-slate-500 uppercase font-black tracking-widest text-xs">Nos meilleurs équipements & produits</p>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-white/5 p-2 rounded-[2.5rem] border border-card-border">
              {['all', 'cafe', 'materiel'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-10 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === tab ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl" : "text-slate-400 hover:text-primary-500"
                  )}
                >
                  {tab === 'all' ? 'Tous' : tab}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, i) => (
                <motion.div 
                  layout
                  key={p.designation} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary-600/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative p-10 rounded-[4rem] bg-card border border-card-border hover:border-primary-500/50 transition-all duration-700 h-full flex flex-col shadow-premium hover:shadow-2xl">
                    {p.premium && (
                      <div className="absolute top-10 right-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">
                        <Award size={12} /> Elite
                      </div>
                    )}
                    
                    <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary-500 mb-10 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-700 rotate-3 group-hover:rotate-0">
                      {p.type === 'cafe' ? <Coffee size={36} /> : <Settings size={36} />}
                    </div>
                    
                    <h3 className="font-black text-3xl mb-3 tracking-tighter leading-tight group-hover:text-primary-600 transition-colors uppercase">{p.designation}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">{p.type === 'cafe' ? 'Coffee Grains' : 'Hardware Pro'}</p>
                    
                    <div className="mt-auto pt-8 border-t border-dashed border-card-border flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Investissement</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{Number(p.prix_unitaire_ttc).toLocaleString('fr-FR')} <span className="text-sm">DH</span></span>
                      </div>
                      <button className="w-16 h-16 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-xl active:scale-90">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Unique Layout */}
      <section id="contact" className="px-8 py-60">
        <div className="max-w-7xl mx-auto rounded-[5rem] bg-slate-900 dark:bg-white text-white dark:text-black p-12 md:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(92,108,235,0.4),transparent_50%)] pointer-events-none" />
           
           <div className="relative z-10 grid lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                 <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.8]">LET'S <br /> CREATE.</h2>
                 <p className="text-xl font-medium opacity-60 leading-relaxed max-w-sm">Prêt à transformer votre vision en réalité ? Notre équipe attend votre signal.</p>
                 
                 <div className="space-y-8">
                    {[
                      { icon: Phone, val: '0611796862' },
                      { icon: Mail, val: 'contact@cafestock.ma' },
                      { icon: MapPin, val: 'Beni Mellal, Maroc' }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                          <c.icon size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight">{c.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                <input type="text" placeholder="NOM COMPLET" className="w-full bg-white/5 dark:bg-black/5 border-2 border-white/10 dark:border-black/10 rounded-3xl px-8 py-6 text-sm font-black outline-none focus:border-primary-500 transition-all placeholder:text-white/20 dark:placeholder:text-black/20" />
                <input type="email" placeholder="EMAIL PROFESSIONNEL" className="w-full bg-white/5 dark:bg-black/5 border-2 border-white/10 dark:border-black/10 rounded-3xl px-8 py-6 text-sm font-black outline-none focus:border-primary-500 transition-all placeholder:text-white/20 dark:placeholder:text-black/20" />
                <textarea rows={4} placeholder="VOTRE PROJET" className="w-full bg-white/5 dark:bg-black/5 border-2 border-white/10 dark:border-black/10 rounded-3xl px-8 py-6 text-sm font-black outline-none focus:border-primary-500 transition-all resize-none placeholder:text-white/20 dark:placeholder:text-black/20"></textarea>
                <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-8 rounded-[2.5rem] transition-all uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95">Envoyer le message</button>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-20 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="font-black text-[12vw] tracking-tighter opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">CAFESTOCK</div>
          <div className="font-black text-5xl tracking-tighter">CAFE<span className="text-primary-600">STOCK</span></div>
          <div className="flex justify-center gap-10">
             {[Instagram, Facebook, Phone].map((Icon, i) => (
               <a key={i} href="#" className="text-slate-400 hover:text-primary-600 transition-all hover:scale-125"><Icon size={24} /></a>
             ))}
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 DESIGNED FOR EXCELLENCE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Mobile Bottom Nav - Unique Design */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-card/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-card-border rounded-[2.5rem] p-3 flex justify-around items-center z-[100] md:hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {[
          { icon: Star, label: 'TOP', href: '#hero' },
          { icon: Sparkles, label: 'ART', href: '#about' },
          { icon: Zap, label: 'SHOP', href: '#catalogue' },
          { icon: Phone, label: 'CALL', href: '#contact' },
        ].map((item, i) => (
          <a key={i} href={item.href} className="flex flex-col items-center gap-1.5 p-4 text-slate-400 hover:text-primary-600 transition-all group">
            <item.icon size={22} className="group-hover:scale-125 transition-transform" />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
