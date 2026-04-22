import { Product, Client, Sale, StockMovement } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    designation: 'Machine Espresso Professional 2 Groupes',
    type: 'materiel',
    unite: 'unité',
    prix_unitaire_ttc: 45000,
    quantite_stock: 5,
    seuil_alerte: 2,
  },
  {
    id: 'p2',
    designation: 'Moulin à Café Automatique',
    type: 'materiel',
    unite: 'unité',
    prix_unitaire_ttc: 8500,
    quantite_stock: 12,
    seuil_alerte: 3,
  },
  {
    id: 'p3',
    designation: 'Café Arabica Excellence (Sachet 1kg)',
    type: 'cafe',
    unite: 'kg',
    prix_unitaire_ttc: 180,
    quantite_stock: 500,
    seuil_alerte: 50,
  },
  {
    id: 'p4',
    designation: 'Café Robusta Intense (Sachet 1kg)',
    type: 'cafe',
    unite: 'kg',
    prix_unitaire_ttc: 120,
    quantite_stock: 300,
    seuil_alerte: 40,
  },
  {
    id: 'p5',
    designation: 'Lave-Verres Professionnel',
    type: 'materiel',
    unite: 'unité',
    prix_unitaire_ttc: 12000,
    quantite_stock: 2,
    seuil_alerte: 1,
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    nom: 'Café La Renaissance',
    adresse: 'Av. Mohammed V, Beni Mellal',
    telephone: '0523485599',
    ice: '001548772000045',
    date_creation: new Date().toISOString(),
  },
  {
    id: 'c2',
    nom: 'Hotel Atlas Grand',
    adresse: 'Route d\'Azilal, Beni Mellal',
    telephone: '0523441122',
    ice: '002365889000088',
    date_creation: new Date().toISOString(),
  },
];
