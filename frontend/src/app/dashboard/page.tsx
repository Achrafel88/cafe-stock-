'use client';

import React from 'react';
import Shell from '@/components/Shell';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/format';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Package, Users, AlertTriangle, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export default function DashboardPage() {
  const { products, clients, sales, isLowStock } = useData();

  const totalStockValue = products.reduce((acc, p) => acc + (Number(p.prix_unitaire_ttc || 0) * Number(p.quantite_stock || 0)), 0);
  const totalCA = sales.reduce((acc, s) => acc + Number(s.total_ttc || 0), 0);
  const lowStockProducts = products.filter(isLowStock);

  const stockData = products.slice(0, 6).map(p => ({
    name: p.designation,
    stock: Number(p.quantite_stock || 0)
  }));

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  const currentYear = new Date().getFullYear();
  
  const caByMonth = months.map((month, index) => {
    const monthlyTotal = sales.reduce((acc, s) => {
      const saleDate = new Date(s.date_facture);
      return (saleDate.getMonth() === index && saleDate.getFullYear() === currentYear) ? acc + Number(s.total_ttc || 0) : acc;
    }, 0);
    return { name: month, total: monthlyTotal };
  }).filter((_, i) => i <= new Date().getMonth());

  return (
    <Shell>
      <div className="space-y-10 pb-20">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Valeur du Stock" value={formatCurrency(totalStockValue)} icon={Package} color="primary" trend="+12.5%" />
          <StatCard title="Chiffre d'Affaires" value={formatCurrency(totalCA)} icon={TrendingUp} color="emerald" trend="+8.2%" />
          <StatCard title="Total Clients" value={clients.length.toString()} icon={Users} color="indigo" />
          <StatCard title="Alertes Stock" value={lowStockProducts.length.toString()} icon={AlertTriangle} color="rose" isAlert={lowStockProducts.length > 0} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-6 md:p-10">
            <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tighter">Performance Mensuelle</h3>
            <p className="text-sm font-bold text-primary-500 mb-10 uppercase tracking-widest">Flux de revenus {currentYear}</p>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={caByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--foreground)', fontSize: 12, fontWeight: 800}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--foreground)', fontSize: 12, fontWeight: 800}} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 900 }} />
                  <Line type="monotone" dataKey="total" stroke="#5c6ceb" strokeWidth={5} dot={{ r: 8, fill: '#5c6ceb', strokeWidth: 4, stroke: 'var(--card)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-tighter text-center">Top Stock</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockData} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="stock">
                    {stockData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Critical Products Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-8 bg-slate-900 dark:bg-white flex justify-between items-center">
             <h3 className="text-xl font-black text-white dark:text-slate-900 uppercase">Produits Critiques</h3>
             <button className="bg-primary-600 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Inventaire Complet</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-black uppercase tracking-[0.2em] text-primary-500 bg-primary-50 dark:bg-slate-800/30">
                  <th className="px-8 py-6">Désignation</th>
                  <th className="px-8 py-6">Stock</th>
                  <th className="px-8 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100/50 dark:divide-slate-800">
                {lowStockProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors">
                    <td className="px-8 py-6 font-black text-foreground uppercase tracking-tight">{p.designation}</td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-rose-600">{p.quantite_stock}</span>
                      <span className="text-[10px] ml-2 font-bold text-slate-400 uppercase">{p.unite}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-2 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/30">Alerte</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatCard({ title, value, icon: Icon, color, trend, isAlert }: any) {
  const colorClasses: any = {
    primary: "bg-blue-600 shadow-blue-500/30",
    emerald: "bg-emerald-600 shadow-emerald-500/30",
    indigo: "bg-indigo-600 shadow-indigo-500/30",
    rose: "bg-rose-600 shadow-rose-500/30",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-8 relative overflow-hidden group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl transition-transform group-hover:rotate-6", colorClasses[color])}>
        <Icon size={28} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-2">{title}</p>
      <h3 className="text-3xl font-black text-foreground tracking-tighter">{value}</h3>
      {trend && <div className="mt-4 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full inline-block border border-emerald-200 dark:border-emerald-500/20">{trend}</div>}
      {isAlert && <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-rose-600 animate-ping" />}
    </motion.div>
  );
}
