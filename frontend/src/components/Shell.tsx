'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  History, 
  Menu as MenuIcon, 
  X,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Produits & Stock', icon: Package, href: '/products' },
  { label: 'Clients', icon: Users, href: '/clients' },
  { label: 'Ventes', icon: ShoppingCart, href: '/sales' },
  { label: 'Historique', icon: History, href: '/history' },
  { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { products, isLowStock } = useData();
  const { theme, setTheme } = useTheme();
  
  const lowStockCount = products.filter(isLowStock).length;

  useEffect(() => {
    setMounted(true);
    setIsMobileMenuOpen(false);
    // On small screens, close sidebar by default
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shrink-0">C</div>
          <span className="font-black text-xl tracking-tight whitespace-nowrap text-foreground ">
            CAFE<span className="text-primary-600">STOCK</span>
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 hover:bg-primary-50 rounded-xl transition-colors hidden lg:block"
        >
          {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="p-2 hover:bg-primary-50 rounded-xl transition-colors lg:hidden block"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center p-3 rounded-2xl transition-all relative group",
              isActive 
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30" 
                : "text-slate-500 hover:text-primary-600 hover:bg-primary-50/50"
            )}
            >
              <div className={cn(
                "p-2.5 rounded-xl transition-all border border-transparent shrink-0",
                !isActive && "bg-slate-50 group-hover:bg-primary-50",
                (isSidebarOpen || isMobileMenuOpen) ? "mr-4" : "mx-auto"
              )}>
                <item.icon size={20} />
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-sm tracking-tight whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 space-y-4 shrink-0">
        <button 
          onClick={() => { 
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            window.location.href = '/admin'; 
          }}
          className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 hover:bg-rose-100 transition-all w-full flex justify-center items-center group font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={20} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="ml-3 text-sm font-bold">Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[50] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[60] border-r border-slate-100 lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          "bg-white border-r border-slate-100 flex flex-col z-40 relative transition-all duration-300",
          "hidden lg:flex"
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#fafafa]">
        <header className="h-16 lg:h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center px-4 lg:px-8 justify-between print-hidden z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
            >
              <MenuIcon size={20} />
            </button>
            <h1 className="text-base lg:text-2xl font-black uppercase tracking-tight text-slate-950 truncate max-w-[120px] sm:max-w-none">
              {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Aperçu'}
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] lg:text-sm font-black uppercase tracking-widest text-primary-600">NILE EQUIPEMENT</p>
              <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">BENI MELLAL • MAROC</p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 p-[2px] shrink-0 shadow-lg shadow-primary-600/20">
              <div className="w-full h-full rounded-[9px] lg:rounded-[14px] bg-white flex items-center justify-center font-black text-primary-600 text-sm lg:text-base">
                BH
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
