'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Settings, ChevronRight, Sparkles, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'cafe' | 'materiel'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('http://127.0.0.1:5001/api/public/products')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setProducts([
            { designation: 'Machine Espresso Pro 2G', type: 'materiel', prix_unitaire_ttc: 45000.00 },
            { designation: 'Moulin Automatique', type: 'materiel', prix_unitaire_ttc: 8500.00 },
            { designation: 'Café Arabica Excellence (1kg)', type: 'cafe', prix_unitaire_ttc: 180.00 },
          ]);
        } else { setProducts(data); }
      });
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-600 font-sans">
      <nav className="fixed w-full z-50 p-6 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="font-black text-2xl tracking-tighter flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold rotate-3">C</div>
          <span className="text-primary-950 text-3xl">CAFE<span className="text-primary-600 underline underline-offset-4">STOCK</span></span>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-8 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary-100 text-primary-700 text-[11px] font-black uppercase tracking-[0.25em] mb-10">
              <Sparkles size={14} /> L'Art de l'espresso
            </div>
            <h1 className="text-8xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-10 text-primary-950">PURE <span className="text-primary-600">ENERGY.</span></h1>
            <p className="text-xl text-primary-800 mb-12 italic">Équipez votre établissement avec l'excellence technique et le goût authentique.</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a href="#catalogue" className="px-10 py-6 bg-primary-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-2">Exploration <ChevronRight size={18} /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-8 py-40 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-6xl font-black uppercase mb-8">Let's Create.</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-6"><Phone size={22} /><span>0611796862</span></div>
            </div>
          </div>
          <div className="space-y-6">
            <input type="text" placeholder="NOM COMPLET" className="w-full bg-white/10 border border-white/20 rounded-2xl p-6 text-sm font-black text-white placeholder:text-white/50" />
            <textarea placeholder="PROJET" rows={4} className="w-full bg-white/10 border border-white/20 rounded-2xl p-6 text-sm font-black text-white placeholder:text-white/50" />
            <button className="w-full bg-white text-primary-950 font-black py-6 rounded-3xl uppercase tracking-[0.3em] text-xs">Envoyer</button>
          </div>
        </div>
      </section>
    </div>
  );
}
