const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const bcrypt = require('bcrypt');

const app = express();
const port = 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

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

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- PUBLIC ---
app.get('/api/public/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// --- AUTH ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for: ${username}`);
  
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, users) => {
    if (err) {
      console.error('DB Error during login:', err);
      return res.status(500).json({ message: 'Erreur de base de données' });
    }
    
    if (users.length === 0) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    const user = users[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        console.log('Login successful');
        return res.json({ token: 'fake-token', user: { id: user.id, username: user.username } });
      } else {
        console.log('Login failed: Invalid password');
        return res.status(401).json({ message: 'Identifiants invalides' });
      }
    } catch (bcryptErr) {
      console.error('Bcrypt error:', bcryptErr);
      return res.status(500).json({ message: 'Erreur serveur interne' });
    }
  });
});

app.put('/api/admin/update', (req, res) => {
  const { username, password, userId } = req.body;
  console.log(`Update attempt for userId: ${userId}`);
  
  if (!username) return res.status(400).json({ message: 'Username is required' });

  const performUpdate = async () => {
    try {
      let sql = 'UPDATE users SET username = ? WHERE id = ?';
      let params = [username, userId];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql = 'UPDATE users SET username = ?, password = ? WHERE id = ?';
        params = [username, hashedPassword, userId];
      }

      db.query(sql, params, (err) => {
        if (err) {
          console.error('DB Error during update:', err);
          return res.status(500).json({ message: 'Erreur de base de données' });
        }
        res.json({ message: 'Profil mis à jour' });
      });
    } catch (err) {
      console.error('Error in update route:', err);
      res.status(500).json({ message: 'Erreur serveur interne' });
    }
  };

  performUpdate();
});

// --- SEEDERS ---
app.get('/api/seed-fix', (req, res) => {
  // Sets all sales with client_id 0 to 1 (Assuming 1 is a valid default client)
  db.query('UPDATE sales SET client_id = 1 WHERE client_id = 0 OR client_id IS NULL', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Seed fix applied', affectedRows: result.affectedRows });
  });
});

// --- CLIENTS ---
app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM clients ORDER BY id DESC', (err, results) => {
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

app.put('/api/clients/:id', (req, res) => {
  const { nom, adresse, telephone, ice } = req.body;
  db.query(
    'UPDATE clients SET nom=?, adresse=?, telephone=?, ice=? WHERE id=?',
    [nom, adresse, telephone, ice, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Updated' });
    }
  );
});

app.delete('/api/clients/:id', (req, res) => {
  db.query('DELETE FROM clients WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

// --- PRODUCTS ---
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
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
      res.json({ message: 'Updated' });
    }
  );
});

app.post('/api/products/:id/stock', (req, res) => {
  const { id } = req.params;
  const { qty, reference } = req.body;
  
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.beginTransaction(err => {
      if (err) { conn.release(); return res.status(500).json(err); }
      
      conn.query('UPDATE products SET quantite_stock = quantite_stock + ? WHERE id = ?', [qty, id], err => {
        if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
        
        conn.query('INSERT INTO stock_movements (product_id, type, quantite, reference) VALUES (?, "ENTREE", ?, ?)', 
          [id, qty, reference], err => {
            if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
            
            conn.commit(err => {
              if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
              conn.release();
              res.json({ success: true });
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

// --- SALES ---
app.get('/api/sales', (req, res) => {
  db.query(`SELECT s.*, c.nom as client_nom FROM sales s LEFT JOIN clients c ON s.client_id = c.id ORDER BY s.id DESC`, (err, sales) => {
    if (err) return res.status(500).json(err);
    
    // Fetch all items for all sales
    db.query('SELECT * FROM sale_items', (err, items) => {
      if (err) return res.status(500).json(err);
      
      const salesWithItems = sales.map(sale => ({
        ...sale,
        items: items.filter(item => item.sale_id === sale.id)
      }));
      res.json(salesWithItems);
    });
  });
});

app.post('/api/sales', (req, res) => {
  const { numero_facture, clientId, type_vente, date_facture, mode_paiement, mode_livraison, note, total_ttc, total_ht, total_tva, items } = req.body;
  
  console.log("DEBUG: Received sale data:", req.body);
  if (!clientId) {
    return res.status(400).json({ error: "clientId is missing" });
  }
  
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.beginTransaction(err => {
      if (err) { conn.release(); return res.status(500).json(err); }
      
      const sql = `INSERT INTO sales (numero_facture, client_id, type_vente, date_facture, mode_paiement, mode_livraison, note, total_ttc, total_ht, total_tva, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT')`;
      
      conn.query(sql, [numero_facture, clientId, type_vente, date_facture, mode_paiement, mode_livraison, note, total_ttc, total_ht, total_tva], (err, result) => {
        if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
        
        const saleId = result.insertId;
        const itemValues = items.map(item => [saleId, item.productId, item.designation, item.quantite, item.prix_unitaire_ttc, item.total_ttc]);
        
        conn.query('INSERT INTO sale_items (sale_id, product_id, designation, quantite, prix_unitaire_ttc, total_ttc) VALUES ?', [itemValues], (err) => {
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
      
      // Get sale items to update stock
      conn.query('SELECT * FROM sale_items WHERE sale_id = ?', [saleId], (err, items) => {
        if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
        
        // Update stock for each item
        const updatePromises = items.map(item => {
          return new Promise((resolve, reject) => {
            conn.query('UPDATE products SET quantite_stock = quantite_stock - ? WHERE id = ?', [item.quantite, item.product_id], (err) => {
              if (err) return reject(err);
              
              conn.query('INSERT INTO stock_movements (product_id, type, quantite, reference) VALUES (?, "SORTIE", ?, ?)', 
                [item.product_id, item.quantite, `Facture #${saleId}`], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
            });
          });
        });
        
        Promise.all(updatePromises)
          .then(() => {
            conn.query('UPDATE sales SET status = "VALIDATED" WHERE id = ?', [saleId], (err) => {
              if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
              
              conn.commit(err => {
                if (err) return conn.rollback(() => { conn.release(); res.status(500).json(err); });
                conn.release();
                res.json({ message: 'Validated' });
              });
            });
          })
          .catch(err => {
            conn.rollback(() => { conn.release(); res.status(500).json(err); });
          });
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
  db.query(`SELECT m.*, p.designation as product_nom FROM stock_movements m LEFT JOIN products p ON m.product_id = p.id ORDER BY m.date DESC`, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${port}`);
});
