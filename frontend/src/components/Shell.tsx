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
  }, [pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-foreground font-bold">C</div>
          <span className="font-black text-xl tracking-tight whitespace-nowrap text-foreground ">
            CAFE<span className="text-primary-600">STOCK</span>
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 hover:bg-primary-50 hover:bg-primary-50 rounded-xl transition-colors hidden md:block"
        >
          {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="p-2 hover:bg-primary-50 hover:bg-primary-50 rounded-xl transition-colors md:hidden block"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center p-3 rounded-2xl transition-all relative group",
              isActive 
                ? "bg-primary-600 text-white  shadow-lg shadow-primary-600/30" 
                : "text-primary-600  hover:text-primary-600"
            )}
            >              <div className={cn(
                "p-2.5 rounded-xl transition-all border border-transparent shrink-0",
                !isActive && "bg-primary-50 group-hover:border-primary-200 ",
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

      <div className="p-6 border-t border-[var(--card-border)] space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { window.location.href = '/admin'; }}
            className="p-3 bg-primary-100 border border-primary-200 rounded-2xl text-primary-900 hover:bg-primary-200 transition-all flex-1 flex justify-center items-center group font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={20} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="ml-3 text-sm font-bold">Déconnexion</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-primary-950/60 backdrop-blur-sm z-[50] md:hidden"
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
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--sidebar)] z-[60] border-r border-[var(--card-border)] md:hidden"
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
          "bg-[var(--sidebar)] border-r border-[var(--card-border)] flex flex-col z-40 relative transition-colors duration-300",
          "hidden md:flex"
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 md:h-20 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center px-4 md:px-8 justify-between print-hidden z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 bg-white bg-card border border-primary-200 border-primary-200 rounded-xl text-primary-600 "
            >
              <MenuIcon size={20} />
            </button>
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight text-foreground  truncate max-w-[150px] md:max-w-none">
              {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Aperçu'}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-black uppercase tracking-widest text-primary-600">NILE EQUIPEMENT</p>
              <p className="text-[10px] font-bold text-primary-600  uppercase tracking-tighter">BENI MELLAL • MAROC</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 p-[2px] shrink-0 shadow-lg shadow-primary-600/20">
              <div className="w-full h-full rounded-[9px] md:rounded-[14px] bg-white bg-[#0f172a] flex items-center justify-center font-black text-primary-600 text-sm md:text-base">
                BH
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
