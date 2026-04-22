const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: '127.0.0.1',
  port: 8889,
  user: 'root',
  password: 'root',
  multipleStatements: true, // IMPORTANT for running the whole script
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};

const connection = mysql.createConnection(dbConfig);

console.log('🚀 Démarrage de la migration des tables...');

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

connection.connect(err => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }

  console.log('✅ Connecté à MySQL.');

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Erreur pendant la migration:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('✅ Migration réussie ! Les tables ont été créées.');
    console.log('📦 Données de démo insérées.');
    connection.end();
    process.exit(0);
  });
});
