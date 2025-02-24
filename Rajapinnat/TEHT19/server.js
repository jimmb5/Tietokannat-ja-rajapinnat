const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// MySQL-yhteys
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'a',  // Lisää oma salasanasi, jos käytössä
  database: 'Opintorekisteri'
});

// Yhdistetään MySQL-tietokantaan
db.connect(err => {
  if (err) {
    console.error('Virhe tietokantayhteydessä: ' + err.stack);
    return;
  }
  console.log('Yhteys tietokantaan onnistui!');
});

// Käytetään body-parseria JSON-tiedoille
app.use(bodyParser.json());

// 1. Käyttäjän rekisteröinti
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Kryptataan salasana ennen tallentamista
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Virhe salasanan kryptaamisessa', error: err });
    }

    const query = 'INSERT INTO user (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Virhe käyttäjän rekisteröinnissä', error: err });
      }
      res.status(201).json({ message: 'Käyttäjä rekisteröity' });
    });
  });
});

// 2. Käyttäjän kirjautuminen
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Haetaan käyttäjä tietokannasta
  const query = 'SELECT * FROM user WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Virhe kirjautumisessa', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Käyttäjää ei löydy' });
    }

    const user = results[0];

    // Tarkistetaan, että salasana täsmää kryptattuun salasanaan
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Virhe salasanan vertailussa', error: err });
      }

      if (isMatch) {
        res.status(200).json({ message: 'Kirjautuminen onnistui' });
      } else {
        res.status(401).json({ message: 'Virheellinen salasana' });
      }
    });
  });
});

// 3. MyAuthorizer-funktio (autentikointi ja tunnistautuminen)
const myAuthorizer = (req, res, next) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Virhe käyttäjän tarkistuksessa', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Käyttäjää ei löydy' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Virhe salasanan vertailussa', error: err });
      }

      if (isMatch) {
        next();  // Käyttäjä tunnistettu, jatka seuraavaan käsittelyyn
      } else {
        res.status(401).json({ message: 'Virheellinen salasana' });
      }
    });
  });
};

// Esimerkiksi suojattu reitti käyttäen myAuthorizer-funktiota
app.get('/api/protected', myAuthorizer, (req, res) => {
  res.status(200).json({ message: 'Tämä reitti on suojattu ja käyttäjä tunnistettu' });
});

// Käynnistetään palvelin
app.listen(port, () => {
  console.log(`Palvelin käynnissä portissa ${port}`);
});
