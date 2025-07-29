import sqlite3 from "sqlite3";
import sha256 from "sha256";

const DBSOURCE = "db.sqlite";
sqlite3.verbose();

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            address TEXT,   -- <<< KOLOM BARU
            photoUrl TEXT,  -- <<< KOLOM BARU
            CONSTRAINT email_unique UNIQUE (email)
            )`,
      (err) => {
        if (err) {
          console.log("Error on create table user", err.message);
          return;
        } else {
          var insert =
            "INSERT INTO user (name, email, password, address, photoUrl) VALUES (?,?,?,?,?)"; // <<< SESUAIKAN INSERT
          db.run(insert, [
            "firly",
            "firly@gmail.com",
            sha256("firly"),
            "Jl. Spring Avenue No. 1, Bekasi",
            "https://i.pravatar.cc/150?img=1",
          ]); // Contoh data
          db.run(insert, [
            "user",
            "user@gmail.com",
            sha256("user"),
            "Jl. Lain No. 2, Bandung",
            "https://i.pravatar.cc/150?img=2",
          ]); // Contoh data
        }
      }
    );
    console.log("Continue create table products");
    db.run(
      `CREATE TABLE product (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                price REAL,
                discountPercentage REAL,
                rating REAL,
                stock INTEGER,
                brand TEXT,
                category TEXT,
                thumbnail TEXT,
                images TEXT,
                CONSTRAINT title_unique UNIQUE (title)
            )`,
      (err) => {
        if (err) {
          console.log("Error on create table product", err.message);
          return;
        } else {
          var insert = `INSERT INTO product (title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images)
                VALUES (?,?,?,?,?,?,?,?,?,?)`;

          // --- DATA PARFUM BARU ---
          db.run(insert, [
            "Chanel No. 5",
            "A timeless, iconic, and elegant floral aldehyde fragrance for women.",
            150.0,
            5.0,
            4.8,
            50,
            "Chanel",
            "Eau de Parfum",
            "chanelno5.png",
            "chanelno5.png",
          ]);
          db.run(insert, [
            "Dior Sauvage",
            "A fresh, raw, and noble composition, inspired by wild, open spaces.",
            120.0,
            3.0,
            4.7,
            75,
            "Dior",
            "Eau de Toilette",
            "diorsauvage.png",
            "diorsauvage.png",
          ]);
          db.run(insert, [
            "Versace Bright Crystal",
            "A floral-fruity fragrance, luminous and sensual, for a woman who is strong and confident yet feminine.",
            85.0,
            10.0,
            4.5,
            90,
            "Versace",
            "Eau de Toilette",
            "versacebc.png",
            "versacebc.png",
          ]);
          db.run(insert, [
            "Jo Malone London Wood Sage & Sea Salt",
            "A captivating, fresh, and sophisticated fragrance that evokes the feeling of the ocean.",
            110.0,
            0.0,
            4.6,
            60,
            "Jo Malone London",
            "Eau de Cologne",
            "jomalone.png",
            "jomalone.png",
          ]);
          db.run(insert, [
            "Gucci Bloom",
            "A rich, white floral scent that transports you to a blooming garden.",
            95.0,
            8.0,
            4.4,
            80,
            "Gucci",
            "Eau de Parfum",
            "guccibloom.png",
            "guccibloom.png",
          ]);
          db.run(insert, [
            "Yves Saint Laurent Libre",
            "A bold and sensual floral fragrance for women, representing freedom.",
            130.0,
            7.0,
            4.7,
            65,
            "YSL",
            "Eau de Parfum",
            "ysllibre.png",
            "ysllibre.png",
          ]);
          db.run(insert, [
            "Carolina Herrera Good Girl",
            "A powerful and sensual fragrance with an innovative contrast of luminous tuberose and roasted tonka bean.",
            105.0,
            6.0,
            4.6,
            70,
            "Carolina Herrera",
            "Eau de Cologne",
            "carolinaherrera.png",
            "carolinaherrera.png",
          ]);
          db.run(insert, [
            "Cartier Declaration",
            "A fragrance of emotion, a declaration of love, inspired by sincere and spontaneous feelings.",
            90.0,
            4.0,
            4.3,
            55,
            "Cartier",
            "Eau de Toilette",
            "cartier.png",
            "cartier.png",
          ]);
          db.run(insert, [
            "Lemonde Classic",
            "A refreshing and crisp citrus fragrance, perfect for everyday wear.",
            60.0,
            0.0,
            4.1,
            100,
            "Lemonde",
            "Extrait de Parfum",
            "lemonde.png",
            "lemonde.png",
          ]);
          db.run(insert, [
            "Givenchy L'Interdit",
            "A tribute to bold femininity, a forbidden blend of white flowers and a dark accord.",
            115.0,
            9.0,
            4.5,
            45,
            "Givenchy",
            "Eau de Parfum",
            "givenchylinterdit.png",
            "givenchylinterdit.png",
          ]);
        }
      }
    );
  }
});

export default db;