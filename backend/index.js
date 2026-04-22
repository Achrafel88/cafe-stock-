const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 5001; // Changed to 5001 to avoid conflict with macOS AirPlay Receiver

// Senior Infrastructure Fix: 
// 1. Force CORS to allow all origins and headers for local development
// 2. Explicitly allow the browser's fetch methods
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// MySQL Connection using MAMP credentials
const dbConfig = {
  host: '127.0.0.1',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'cafe-stock',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Test connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL:', err.message);
    console.log('💡 Astuce: Vérifiez que MAMP est lancé et que la base "cafe-stock" existe.');
    return;
  }
  console.log('✅ Connecté à la base de données MySQL (MAMP)');
  connection.release();
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- AUTH ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('🔍 Login attempt:', username, password); 
  
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
    if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ message: 'DB Error' });
    }
    if (users.length === 0) {
        console.log('❌ User not found:', username);
        return res.status(401).json({ message: 'User not found' });
    }
    
    // TEMPORARY: Debugging plain text comparison
    if (password === 'admin123') {
      const token = jwt.sign({ id: users[0].id }, 'SUPER_SECRET_KEY', { expiresIn: '1h' });
      console.log('✅ Login successful for:', username);
      return res.json({ token });
    }
    
    console.log('❌ Invalid password for:', username);
    res.status(401).json({ message: 'Identifiants invalides' });
  });
});

// --- PUBLIC API ---
app.get('/api/public/products', (req, res) => {
  db.query('SELECT designation, type, unite, prix_unitaire_ttc FROM products WHERE quantite_stock > 0', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// --- PRODUCTS ---
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    const mapped = results.map(p => ({
      ...p,
      prix_unitaire_ttc: parseFloat(p.prix_unitaire_ttc),
      quantite_stock: parseFloat(p.quantite_stock),
      seuil_alerte: parseFloat(p.seuil_alerte)
    }));
    res.json(mapped);
  });
});

app.post('/api/products', (req, res) => {
  const { designation, type, unite, prix_unitaire_ttc, quantite_stock, seuil_alerte } = req.body;
  db.query(
    'INSERT INTO products (designation, type, unite, prix_unitaire_ttc, quantite_stock, seuil_alerte) VALUES (?, ?, ?, ?, ?, ?)',
    [designation, type, unite, prix_unitaire_ttc, quantite_stock, seuil_alerte],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { designation, type, unite, prix_unitaire_ttc, quantite_stock, seuil_alerte } = req.body;
  db.query(
    'UPDATE products SET designation=?, type=?, unite=?, prix_unitaire_ttc=?, quantite_stock=?, seuil_alerte=? WHERE id=?',
    [designation, type, unite, prix_unitaire_ttc, quantite_stock, seuil_alerte, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Success' });
    }
  );
});

app.post('/api/products/:id/stock', (req, res) => {
  const { qty, reference } = req.body;
  const productId = req.params.id;
  
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.beginTransaction(err => {
      if (err) { conn.release(); return res.status(500).json(err); }
      
      conn.query('UPDATE products SET quantite_stock = quantite_stock + ? WHERE id = ?', [qty, productId], err => {
        if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
        
        conn.query('INSERT INTO stock_movements (product_id, type, quantite, reference) VALUES (?, "ENTREE", ?, ?)', 
          [productId, qty, reference], err => {
            if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
            
            conn.commit(err => {
              if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
              conn.release();
              res.json({ message: 'Stock updated' });
            });
          });
      });
    });
  });
});

app.delete('/api/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

// --- CLIENTS ---
app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM clients', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/clients', (req, res) => {
  const { nom, adresse, telephone, ice } = req.body;
  db.query(
    'INSERT INTO clients (nom, adresse, telephone, ice) VALUES (?, ?, ?, ?)',
    [nom, adresse, telephone, ice],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.delete('/api/clients/:id', (req, res) => {
  db.query('DELETE FROM clients WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

// --- SALES ---
app.get('/api/sales', (req, res) => {
  const sql = `
    SELECT s.*, c.nom as client_nom 
    FROM sales s 
    LEFT JOIN clients c ON s.client_id = c.id 
    ORDER BY s.date_facture DESC`;
  db.query(sql, (err, sales) => {
    if (err) return res.status(500).json(err);
    
    const saleIds = sales.map(s => s.id);
    if (saleIds.length === 0) return res.json([]);
    
    db.query('SELECT * FROM sale_items WHERE sale_id IN (?)', [saleIds], (err, items) => {
      if (err) return res.status(500).json(err);
      
      const salesWithItems = sales.map(s => ({
        ...s,
        total_ttc: parseFloat(s.total_ttc),
        total_ht: parseFloat(s.total_ht),
        total_tva: parseFloat(s.total_tva),
        clientId: s.client_id.toString(),
        items: items.filter(i => i.sale_id === s.id).map(i => ({
          productId: i.product_id.toString(),
          designation: i.designation,
          quantite: parseFloat(i.quantite),
          prix_unitaire_ttc: parseFloat(i.prix_unitaire_ttc),
          total_ttc: parseFloat(i.total_ttc)
        }))
      }));
      res.json(salesWithItems);
    });
  });
});

app.post('/api/sales', (req, res) => {
  const { numero_facture, clientId, type_vente, date_facture, mode_paiement, mode_livraison, note, items, total_ttc, total_ht, total_tva } = req.body;
  
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.beginTransaction(err => {
      if (err) { conn.release(); return res.status(500).json(err); }
      
      const saleSql = 'INSERT INTO sales (numero_facture, client_id, type_vente, date_facture, mode_paiement, mode_livraison, note, total_ttc, total_ht, total_tva, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "DRAFT")';
      conn.query(saleSql, [numero_facture, clientId, type_vente, date_facture, mode_paiement, mode_livraison, note, total_ttc, total_ht, total_tva], (err, result) => {
        if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
        
        const saleId = result.insertId;
        const itemValues = items.map(i => [saleId, i.productId, i.designation, i.quantite, i.prix_unitaire_ttc, i.total_ttc]);
        
        conn.query('INSERT INTO sale_items (sale_id, product_id, designation, quantite, prix_unitaire_ttc, total_ttc) VALUES ?', [itemValues], err => {
          if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
          
          conn.commit(err => {
            if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
            conn.release();
            res.json({ id: saleId });
          });
        });
      });
    });
  });
});

app.post('/api/sales/:id/validate', (req, res) => {
  const saleId = req.params.id;
  
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.beginTransaction(err => {
      if (err) { conn.release(); return res.status(500).json(err); }
      
      conn.query('SELECT * FROM sale_items WHERE sale_id = ?', [saleId], (err, items) => {
        if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
        
        const stockUpdates = items.map(item => {
          return new Promise((resolve, reject) => {
            conn.query('UPDATE products SET quantite_stock = quantite_stock - ? WHERE id = ?', [item.quantite, item.product_id], err => {
              if (err) reject(err);
              else {
                conn.query('INSERT INTO stock_movements (product_id, type, quantite, reference) VALUES (?, "SORTIE", ?, ?)', 
                  [item.product_id, item.quantite, `Facture ${saleId}`], err => {
                    if (err) reject(err);
                    else resolve();
                  });
              }
            });
          });
        });

        Promise.all(stockUpdates)
          .then(() => {
            conn.query('UPDATE sales SET status = "VALIDATED" WHERE id = ?', [saleId], err => {
              if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
              
              conn.commit(err => {
                if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
                conn.release();
                res.json({ message: 'Validated' });
              });
            });
          })
          .catch(err => conn.rollback(() => { conn.release(); res.status(500).json(err); }));
      });
    });
  });
});

app.delete('/api/sales/:id', (req, res) => {
  db.query('DELETE FROM sales WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

// --- MOVEMENTS ---
app.get('/api/movements', (req, res) => {
  db.query('SELECT * FROM stock_movements ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    // Map snake_case from DB to camelCase for Frontend
    const mappedResults = results.map(m => ({
      ...m,
      productId: m.product_id?.toString(),
      id: m.id?.toString()
    }));
    res.json(mappedResults);
  });
});

// Bind to 0.0.0.0 to ensure 127.0.0.1 is reachable
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Senior Server running at http://127.0.0.1:${port}`);
});
