'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Client, Sale, StockMovement, BusinessType } from '../types';

// Senior Fix: Use port 5001 to avoid AirPlay conflict on Mac
const API_URL = 'http://127.0.0.1:5001/api';

interface DataContextType {
  products: Product[];
  clients: Client[];
  sales: Sale[];
  movements: StockMovement[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStock: (productId: string, qty: number, reference: string) => Promise<void>;
  addClient: (c: Omit<Client, 'id' | 'date_creation'>) => Promise<string>;
  updateClient: (id: string, c: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addSale: (s: Omit<Sale, 'id' | 'status'>) => Promise<string>;
  validateSale: (id: string) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  isLowStock: (p: Product) => boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const refreshData = async () => {
    try {
      console.log('📡 Tentative de connexion au backend:', API_URL);
      const [prodRes, cliRes, saleRes, movRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/clients`),
        fetch(`${API_URL}/sales`),
        fetch(`${API_URL}/movements`)
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (cliRes.ok) setClients(await cliRes.json());
      if (saleRes.ok) setSales(await saleRes.json());
      if (movRes.ok) setMovements(await movRes.json());
      
      console.log('✅ Données synchronisées avec succès.');
    } catch (error) {
      console.error("❌ Erreur de connexion backend:", error);
      console.log("💡 Astuce Senior: Vérifiez que le backend écoute sur 127.0.0.1:5000");
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addProduct = async (p: Omit<Product, 'id'>) => {
    await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    await refreshData();
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    await refreshData();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  const addStock = async (productId: string, qty: number, reference: string) => {
    await fetch(`${API_URL}/products/${productId}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty, reference })
    });
    await refreshData();
  };

  const addClient = async (c: Omit<Client, 'id' | 'date_creation'>) => {
    const res = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c)
    });
    const data = await res.json();
    await refreshData();
    return data.id.toString();
  };

  const updateClient = async (id: string, c: Partial<Client>) => {
    await refreshData();
  };

  const deleteClient = async (id: string) => {
    await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  const addSale = async (s: Omit<Sale, 'id' | 'status'>) => {
    const res = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
    const data = await res.json();
    await refreshData();
    return data.id.toString();
  };

  const validateSale = async (id: string) => {
    await fetch(`${API_URL}/sales/${id}/validate`, { method: 'POST' });
    await refreshData();
  };

  const deleteSale = async (id: string) => {
    await fetch(`${API_URL}/sales/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  const isLowStock = (p: Product) => parseFloat(p.quantite_stock as any) <= parseFloat(p.seuil_alerte as any);

  return (
    <DataContext.Provider value={{
      products, clients, sales, movements,
      addProduct, updateProduct, deleteProduct, addStock,
      addClient, updateClient, deleteClient,
      addSale, validateSale, deleteSale, isLowStock, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
