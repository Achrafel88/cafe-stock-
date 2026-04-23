'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Settings, ChevronRight, Sparkles, Instagram, Facebook, Phone, Mail, MapPin, Search, Menu, X } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'cafe' | 'materiel'>('all');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('http://127.0.0.1:5001/api/public/products')
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          const mock = [
            { id: 1, designation: 'Machine Espresso Pro 2G', type: 'materiel', prix_unitaire_ttc: 45000.00, unite: 'unité' },
            { id: 2, designation: 'Moulin Automatique', type: 'materiel', prix_unitaire_ttc: 8500.00, unite: 'unité' },
            { id: 3, designation: 'Café Arabica Excellence (1kg)', type: 'cafe', prix_unitaire_ttc: 180.00, unite: 'kg' },
            { id: 4, designation: 'Café Robusta Intense (1kg)', type: 'cafe', prix_unitaire_ttc: 120.00, unite: 'kg' },
            { id: 5, designation: 'Machine Grain Auto', type: 'materiel', prix_unitaire_ttc: 12000.00, unite: 'unité' },
          ];
          setProducts(mock);
          setFilteredProducts(mock);
        } else {
          setProducts(data);
          setFilteredProducts(data);
        }
      })
      .catch(() => {
          const mock = [
            { id: 1, designation: 'Machine Espresso Pro 2G', type: 'materiel', prix_unitaire_ttc: 45000.00, unite: 'unité' },
            { id: 2, designation: 'Moulin Automatique', type: 'materiel', prix_unitaire_ttc: 8500.00, unite: 'unité' },
          ];
          setProducts(mock);
          setFilteredProducts(mock);
      });
  }, []);

  useEffect(() => {
    let result = products;
    if (activeTab !== 'all') {
      result = result.filter(p => p.type === activeTab);
    }
    if (search) {
      result = result.filter(p => p.designation.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [activeTab, search, products]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 p-4 md:p-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="font-black text-xl md:text-2xl tracking-tighter flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold rotate-3 shadow-lg shadow-orange-600/20">
            <Coffee size={18} />
          </div>
          <span className="text-slate-900">CAFE<span className="text-orange-600">STOCK</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <a href="#" className="hover:text-orange-600 transition-colors">Accueil</a>
          <a href="#catalogue" className="hover:text-orange-600 transition-colors">Catalogue</a>
          <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
          <Link href="/admin" className="p-2 bg-slate-100 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-all">
            <Settings size={18} />
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-900"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-white p-8 pt-24 flex flex-col gap-8 md:hidden"
          >
            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter">Accueil</a>
            <a href="#catalogue" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter">Catalogue</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter">Contact</a>
            <hr className="border-slate-100" />
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-xl font-bold text-orange-600">
              <Settings size={24} /> Accès Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-8 pt-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] aspect-square bg-orange-100/50 rounded-full blur-[80px] md:blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 md:px-5 py-2 rounded-full bg-orange-100 text-orange-700 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-8 md:mb-10"
          >
            <Sparkles size={14} /> Partenaire des Professionnels
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-[8rem] font-black leading-[0.9] md:leading-[0.8] tracking-tighter mb-8 md:mb-10 text-slate-950"
          >
            L'EXCELLENCE <br /> <span className="text-orange-600">DU CAFÉ.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 md:mb-12 max-w-2xl mx-auto px-4"
          >
            Équipez votre établissement avec le meilleur matériel et servez des grains d'exception sélectionnés avec soin.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            <a href="#catalogue" className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-slate-950 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-slate-950/20 flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95">
              Explorer le Catalogue <ChevronRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="catalogue" className="px-6 md:px-8 py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 md:mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 uppercase mb-4">Notre Sélection</h2>
              <p className="text-slate-500 font-medium">Découvrez notre gamme de produits pour café et matériel professionnel.</p>
            </div>
            
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un produit..." 
                  className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl w-full lg:w-[300px] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
                {['all', 'cafe', 'materiel'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 min-w-[80px] px-4 md:px-6 py-2.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab === 'all' ? 'Tous' : tab === 'cafe' ? 'Café' : 'Matériel'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={p.id || idx}
                  className="group bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 hover:bg-white hover:shadow-2xl hover:shadow-orange-600/10 border border-transparent hover:border-orange-100 transition-all duration-500"
                >
                  <div className="aspect-square rounded-2xl md:rounded-3xl bg-white mb-6 md:mb-8 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                    {p.type === 'cafe' ? (
                      <div className="text-orange-800 text-5xl md:text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700"><Coffee size={60} /></div>
                    ) : (
                      <div className="text-slate-800 text-5xl md:text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700"><Settings size={60} /></div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {p.type === 'cafe' ? 'Café' : 'Matériel'}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">{p.designation}</h3>
                  <div className="flex items-center justify-between mt-4 md:mt-6">
                    <div>
                      <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prix HT</div>
                      <div className="text-xl md:text-2xl font-black text-slate-950">{formatCurrency(p.prix_unitaire_ttc)}</div>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-950 text-white flex items-center justify-center group-hover:bg-orange-600 group-hover:rotate-12 transition-all shadow-xl shadow-slate-950/10">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 md:py-20 bg-slate-50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="text-slate-300 mb-4 flex justify-center"><Search size={40} /></div>
              <p className="text-slate-500 font-bold italic px-4">Aucun produit ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-8 py-20 md:py-32 bg-slate-950 text-white rounded-t-[3rem] md:rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 mb-20 lg:mb-32">
            <div>
              <div className="font-black text-2xl md:text-3xl tracking-tighter flex items-center gap-3 mb-8 md:mb-12">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-600 flex items-center justify-center text-white">
                  <Coffee size={20} />
                </div>
                <span>CAFE<span className="text-orange-600">STOCK</span></span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 md:mb-12 leading-[0.9]">Transformons <br /> votre espace.</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
                <div className="flex items-center gap-4 md:gap-6 group cursor-pointer">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-all shrink-0">
                    <Phone size={20} />
                  </div>
                  <span className="text-lg md:text-xl font-bold tracking-tight">0611796862</span>
                </div>
                <div className="flex items-center gap-4 md:gap-6 group cursor-pointer">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-all shrink-0">
                    <Instagram size={20} />
                  </div>
                  <span className="text-lg md:text-xl font-bold tracking-tight">@cafestock_pro</span>
                </div>
                <div className="flex items-center gap-4 md:gap-6 group cursor-pointer">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-all shrink-0">
                    <MapPin size={20} />
                  </div>
                  <span className="text-lg md:text-xl font-bold tracking-tight">Beni Mellal, Maroc</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6 md:mb-8">Demander un devis</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Nom complet</label>
                  <input type="text" placeholder="VOTRE NOM" className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-sm font-black text-white focus:outline-none focus:border-orange-600 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Projet</label>
                  <textarea placeholder="DÉTAILS DU PROJET" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-sm font-black text-white focus:outline-none focus:border-orange-600 transition-all" />
                </div>
                <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-3xl uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs transition-all shadow-xl shadow-orange-600/20 active:scale-95">Envoyer la demande</button>
              </div>
            </div>
          </div>
          
          <div className="pt-10 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center md:text-left">© 2024 CafeStock Pro. Tous droits réservés.</p>
            <div className="flex gap-6 md:gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <a href="#" className="hover:text-orange-600 transition-colors">Instagram</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Facebook</a>
              <a href="#" className="hover:text-orange-600 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
