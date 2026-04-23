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
    name: p.designation.length > 12 ? p.designation.substring(0, 10) + '..' : p.designation,
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
        {/* Stat Cards - Colors Fixed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Valeur du Stock" value={formatCurrency(totalStockValue)} icon={Package} color="primary" trend="+12.5%" />
          <StatCard title="Chiffre d'Affaires" value={formatCurrency(totalCA)} icon={TrendingUp} color="emerald" trend="+8.2%" />
          <StatCard title="Total Clients" value={clients.length.toString()} icon={Users} color="indigo" />
          <StatCard title="Alertes Stock" value={lowStockProducts.length.toString()} icon={AlertTriangle} color="rose" isAlert={lowStockProducts.length > 0} />
        </div>

        {/* Charts Row - Labels Fixed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-6 md:p-10">
            <h3 className="text-2xl font-black text-foreground  mb-2 uppercase tracking-tighter">Performance Mensuelle</h3>
            <p className="text-sm font-bold text-primary-600  mb-10 uppercase tracking-widest">Revenus {currentYear}</p>
            <div className="h-[350px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={caByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'currentColor', fontSize: 12, fontWeight: 900}}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'currentColor', fontSize: 12, fontWeight: 900}}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '20px', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--color-primary-600)', fontWeight: 900 }}
                    cursor={{ stroke: 'var(--color-primary-600)', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="total" stroke="var(--color-primary-600)" strokeWidth={5} dot={{ r: 8, fill: 'var(--color-primary-600)', strokeWidth: 4, stroke: 'var(--card)' }} activeDot={{ r: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            </div>

            <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[450px] w-full">
            <h3 className="text-xl font-black text-foreground  mb-8 uppercase tracking-tighter">Top Stock</h3>
            <div className="flex-1 w-full h-[300px] min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockData} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="stock">
                    {stockData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>            </div>
          </div>
        </div>

        {/* Critical Products Table - Text Fixed */}
        <div className="glass-card overflow-hidden">
          <div className="p-8 bg-primary-950 bg-primary-950 flex justify-between items-center">
             <h3 className="text-xl font-black text-foreground  uppercase">Produits Critiques</h3>
             <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all">Inventaire</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-black uppercase tracking-[0.2em] text-primary-500  bg-primary-50 bg-card">
                  <th className="px-8 py-6 border-b border-primary-200 border-primary-200">Désignation</th>
                  <th className="px-8 py-6 border-b border-primary-200 border-primary-200">Stock</th>
                  <th className="px-8 py-6 border-b border-primary-200 border-primary-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200 divide-primary-200">
                {lowStockProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-primary-50 hover:bg-primary-50 transition-colors">
                    <td className="px-8 py-6 font-black text-foreground  uppercase tracking-tight">{p.designation}</td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-primary-600">{p.quantite_stock}</span>
                      <span className="text-[10px] ml-2 font-bold text-primary-500  uppercase">{p.unite}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-2 rounded-full bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-600/30">Alerte</span>
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
    primary: "bg-primary-600",
    emerald: "bg-primary-600",
    indigo: "bg-primary-600",
    rose: "bg-primary-600",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-8 relative overflow-hidden group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-foreground mb-6 shadow-2xl transition-transform group-hover:rotate-6", colorClasses[color])}>
        <Icon size={28} />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-600  mb-2">{title}</p>
      <h3 className="text-3xl font-black text-primary-950  tracking-tighter">{value}</h3>
      {trend && <div className="mt-4 text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-600/10 px-3 py-1 rounded-full inline-block border border-primary-200 ">{trend}</div>}
      {isAlert && <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-primary-600 animate-ping" />}
    </motion.div>
  );
}
