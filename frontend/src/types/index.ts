export type BusinessType = 'materiel' | 'cafe';

export interface BusinessIdentity {
  header: string;
  subtitle: string;
  tel: string;
  footer: string;
  patente?: string;
  if?: string;
  rc?: string;
  ice?: string;
  rib?: string;
  pattNo?: string;
  rcn?: string;
  lce?: string;
}

export const IDENTITIES: Record<BusinessType, BusinessIdentity> = {
  materiel: {
    header: "BISSA HASSAN / NILE EQUIPEMENT",
    subtitle: "MARCHAND D'EQUIPEMENT DES CAFE ET RESTAURANTS",
    tel: "0611796862",
    footer: "NILE EQUIPEMENT CAVE LOTIS BOUKAFER N1 BENI MELLAL",
    patente: "41306507",
    if: "68354637",
    rc: "30026",
    ice: "003791561000004",
    rib: "011090000007210000466417 BANK OF AFRICA BMCE GROUPE",
  },
  cafe: {
    header: "STE ZILLALIA CAFE SARL AU",
    subtitle: "MARCHANT DE CAFE EN DEMI GROS",
    tel: "0611796862",
    footer: "DR AIT DAOUD ABOU YAHYA FOUM EL ANSER BENI MELLAL",
    pattNo: "44850470",
    rcn: "6797",
    lce: "000108530000060",
  },
};

export type Unite = 'unité' | 'kg';

export interface Product {
  id: string;
  designation: string;
  type: BusinessType;
  unite: Unite;
  prix_unitaire_ttc: number;
  quantite_stock: number;
  seuil_alerte: number;
}

export interface Client {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  ice: string;
  date_creation: string;
}

export type PaymentMode = 'ESPECE' | 'CHEQUE' | 'VIREMENT';

export interface SaleItem {
  productId: string;
  designation: string;
  quantite: number;
  prix_unitaire_ttc: number;
  total_ttc: number;
}

export type SaleStatus = 'DRAFT' | 'VALIDATED';

export interface Sale {
  id: string;
  numero_facture: string;
  clientId: string;
  type_vente: BusinessType;
  date_facture: string;
  mode_paiement: PaymentMode;
  mode_livraison: string;
  note: string;
  items: SaleItem[];
  total_ttc: number;
  total_ht: number;
  total_tva: number;
  status: SaleStatus;
}

export interface StockMovement {
  id: string;
  productId: string;
  product_id?: string; // Support for backend snake_case
  type: 'ENTREE' | 'SORTIE';
  quantite: number;
  date: string;
  reference: string; // e.g., Facture ID or 'Manuel'
}
