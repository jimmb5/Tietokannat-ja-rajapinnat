const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL-yhteys
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "a", // Vaihda omaksi salasanaksi
  database: "library",
});

db.connect((err) => {
  if (err) {
    console.error("Tietokantayhteys epäonnistui:", err);
  } else {
    console.log("Yhteys MySQL-tietokantaan onnistui!");
  }
});

// Testireitti
app.get("/", (req, res) => {
  res.send("Library API toimii!");
});

// Palvelin kuuntelee porttia 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
// Hae kaikki kirjat
app.get("/books", (req, res) => {
    db.query("SELECT * FROM book", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });
  
  // Hae kaikki lainaajat
  app.get("/borrowers", (req, res) => {
    db.query("SELECT * FROM borrower", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });
// Lisää uusi kirja
app.post("/books", (req, res) => {
  const { name, author, isbn } = req.body;
  if (!name || !author || !isbn) {
    return res.status(400).json({ error: "Kaikki kentät ovat pakollisia!" });
  }

  const sql = "INSERT INTO book (name, author, isbn) VALUES (?, ?, ?)";
  db.query(sql, [name, author, isbn], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Tietokantavirhe" });
    }
    res.status(201).json({ message: "Kirja lisätty!", id: result.insertId });
  });
});
  
  // Lisää uusi lainaaja
  app.post("/borrowers", (req, res) => {
    const { fname, lname, streetaddress } = req.body;
    db.query("INSERT INTO borrower (fname, lname, streetaddress) VALUES (?, ?, ?)", [fname, lname, streetaddress], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Lainaaja lisätty!", id: result.insertId });
    });
  });
    // Päivitä kirja
app.put("/books/:id", (req, res) => {
    const { name, author, isbn } = req.body;
    db.query("UPDATE book SET name=?, author=?, isbn=? WHERE id_book=?", [name, author, isbn, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Kirja päivitetty!" });
    });
  });
  
  // Päivitä lainaaja
  app.put("/borrowers/:id", (req, res) => {
    const { fname, lname, streetaddress } = req.body;
    db.query("UPDATE borrower SET fname=?, lname=?, streetaddress=? WHERE id_borrower=?", [fname, lname, streetaddress, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Lainaaja päivitetty!" });
    });
  });
  // Poista kirja
app.delete("/books/:id", (req, res) => {
    db.query("DELETE FROM book WHERE id_book=?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Kirja poistettu!" });
    });
  });
  
  // Poista lainaaja
  app.delete("/borrowers/:id", (req, res) => {
    db.query("DELETE FROM borrower WHERE id_borrower=?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Lainaaja poistettu!" });
    });
  });
  