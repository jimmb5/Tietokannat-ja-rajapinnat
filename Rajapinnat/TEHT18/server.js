const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

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

// 1. CREATE: Lisää opiskelija
app.post('/api/opiskelija', (req, res) => {
  const { etunimi, sukunimi, syntymäaika, sähköposti, puhelinnumero } = req.body;
  const query = 'INSERT INTO Opiskelija (etunimi, sukunimi, syntymäaika, sähköposti, puhelinnumero) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [etunimi, sukunimi, syntymäaika, sähköposti, puhelinnumero], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Virhe opiskelijan lisäämisessä', error: err });
    }
    res.status(201).json({ message: 'Opiskelija lisätty', opiskelija_id: result.insertId });
  });
});

// 2. READ: Hae kaikki opiskelijat
app.get('/api/opiskelijat', (req, res) => {
  const query = 'SELECT * FROM Opiskelija';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Virhe opiskelijoiden hakemisessa', error: err });
    }
    res.status(200).json(results);
  });
});

// 3. UPDATE: Päivitä opiskelija
app.put('/api/opiskelija/:id', (req, res) => {
  const { id } = req.params;
  const { etunimi, sukunimi, syntymäaika, sähköposti, puhelinnumero } = req.body;
  
  const query = 'UPDATE Opiskelija SET etunimi = ?, sukunimi = ?, syntymäaika = ?, sähköposti = ?, puhelinnumero = ? WHERE opiskelija_id = ?';
  
  db.query(query, [etunimi, sukunimi, syntymäaika, sähköposti, puhelinnumero, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Virhe opiskelijan päivittämisessä', error: err });
    }
    res.status(200).json({ message: 'Opiskelija päivitetty' });
  });
});

// 4. DELETE: Poista opiskelija
app.delete('/api/opiskelija/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Opiskelija WHERE opiskelija_id = ?';
    
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Virhe opiskelijan poistamisessa', error: err });
      }
      res.status(200).json({ message: 'Opiskelija poistettu' });
    });
  });

// Käynnistetään palvelin
app.listen(port, () => {
  console.log(`Palvelin käynnissä portissa ${port}`);
});
