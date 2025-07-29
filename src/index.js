// src/index.js - KODE LENGKAP YANG SUDAH DIPERBAIKI DAN DITAMBAHKAN
import express, { json, urlencoded } from "express";
import bodyParser from "body-parser";
import url from "url"; // Tidak terpakai, bisa dihapus
import querystring from "querystring"; // Tidak terpakai, bisa dihapus
import db from "./database/sqlite.js";
import { body, validationResult } from "express-validator";
import AuthMiddleware from "./middleware/auth.middleware.js";
import jwt from "./helper/jwt.helper.js";
import { log } from "console";
import sha256 from "sha256";
import cors from "cors";
import path from "path"; // Untuk path.join

const app = express();
app.use(cors());
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Tambahkan ini untuk melayani file statis (gambar)
// Pastikan folder 'src/images' ada dan berisi gambar-gambar Anda
app.use("/images", express.static(path.join(process.cwd(), "src", "images")));
// console.log("Serving static files from:", path.join(process.cwd(), "src", "images")); // Debugging

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: "Welcome to Web Service Univ. Bani Saleh",
  });
});

app.post(
  "/login",
  [
    body("email", "Email is required").notEmpty(),
    body("email", "Email is not valid").isEmail(),
    body("password", "Password is required").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      db.get("SELECT * FROM user WHERE email=?", [email], (err, data) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            success: false,
            message: err?.message || "Internal server error",
          });
        } else {
          console.log("data", data);
          if (!data) {
            return res.status(401).json({
              status: 401,
              success: false,
              message: "User not found", // Tidak perlu err?.message di sini
            });
          }
          const userPassword = data?.password;
          if (sha256(password) == userPassword) {
            delete data.password; // Hapus password sebelum membuat token
            const [payload, token] = jwt.createToken({
              data: {
                id: data.id,
                name: data.name,
                email: data.email,
                address: data.address,
                photoUrl: data.photoUrl,
              }, // Hanya sertakan data yang relevan
            });
            res.json({ success: true, user: data, access_token: token });
          } else {
            res.status(401).json({
              status: 401,
              success: false,
              message: "Incorrect password",
            });
          }
        }
      });
    } else {
      return res.status(422).json({ errors: errors.array() });
    }
  }
);

// ===============================================
// === START: PENAMBAHAN/PERBAIKAN UNTUK PROFIL ===
// ===============================================

// Tambahkan endpoint untuk mengambil profil pengguna
// Ini adalah endpoint yang dipanggil oleh fetchUserProfile di Flutter
app.get("/users/profile", AuthMiddleware, async (req, res) => {
  // AuthMiddleware akan menambahkan req.user ke objek request jika token valid
  // Sekarang req.user seharusnya sudah berisi objek data langsung dari payload
  if (!req.user || !req.user.id) {
    // Cek langsung req.user.id
    return res
      .status(401)
      .json({ message: "Unauthorized: User ID not found in token." });
  }

  const userId = req.user.id; // Dapatkan ID pengguna dari token JWT
  console.log("Fetching profile for user ID:", userId); // Debugging

  db.get(
    `SELECT id, name, email, address, photoUrl FROM user WHERE id=?`,
    [userId],
    (err, data) => {
      if (err) {
        console.error("Error fetching user profile from DB:", err);
        return res.status(500).json({
          status: 500,
          success: false,
          message:
            err?.message || "Internal server error fetching user profile",
        });
      }

      if (!data) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User profile not found.",
        });
      }

      res.json(data); // Kirim data profil pengguna
    }
  );
});

// ===============================================
// === END: PENAMBAHAN/PERBAIKAN UNTUK PROFIL ===
// ===============================================

// Endpoint products yang mendukung pencarian dan filter kategori
// Pindahkan AuthMiddleware HANYA untuk endpoint yang memerlukannya,
// JANGAN taruh app.use(AuthMiddleware) di atas jika /products tidak butuh otentikasi.
// Contohnya, endpoint GET /products TIDAK memerlukan otentikasi.
// Endpoint POST/PUT/DELETE /products mungkin memerlukan otentikasi.

app.get("/products", (req, res) => {
  // Tidak dilindungi oleh AuthMiddleware
  const page = parseInt(req.query.page || 1);
  const perPage = parseInt(req.query.perpage || 10);
  const query = req.query.q || ""; // Parameter pencarian
  const category = req.query.category || ""; // Parameter kategori
  const offset = (page - 1) * perPage;

  let sql = `select * from product`;
  let countSql = `select count(*) as total from product`;
  let params = [];
  let countParams = [];
  let whereClauses = [];

  if (query) {
    whereClauses.push(`title LIKE ?`);
    params.push(`%${query}%`);
    countParams.push(`%${query}%`);
  }

  if (category) {
    whereClauses.push(`category = ?`);
    params.push(category);
    countParams.push(category);
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ` + whereClauses.join(" AND ");
    countSql += ` WHERE ` + whereClauses.join(" AND ");
  }

  sql += ` LIMIT ${perPage} OFFSET ${offset}`;

  db.all(sql, params, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, success: false, message: err.message });
    }
    db.get(countSql, countParams, (err, count) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, success: false, message: err.message });
      }
      // Memperbaiki URL gambar di sini
      const productsWithFullImageUrls = data.map((product) => {
        // Asumsi thumbnail dan images adalah nama file (e.g., "nama_gambar.png")
        // dan server Anda melayani gambar dari /images/
        const baseUrlForImages = `${req.protocol}://${req.get("host")}/images/`;
        return {
          ...product,
          thumbnail: product.thumbnail
            ? `${baseUrlForImages}${product.thumbnail}`
            : null,
          images: product.images
            ? product.images
                .split(",")
                .map((img) => `${baseUrlForImages}${img.trim()}`)
                .join(",")
            : null,
        };
      });

      res.json({
        data: productsWithFullImageUrls,
        totalRows: count.total,
        page,
        perPage,
      });
    });
  });
});

// Endpoint berikut mungkin perlu otentikasi, jadi pasang AuthMiddleware di sini:
app.get("/products/:id", AuthMiddleware, (req, res) => {
  // Dilindungi AuthMiddleware
  const id = req.params.id;
  db.get(`select * from product where id=?`, [id], (err, data) => {
    if (err || !data) {
      res.status(404).json({
        status: 404,
        success: false,
        message: err?.message || "Data not found",
      });
    } else {
      // Memperbaiki URL gambar untuk detail produk juga
      const baseUrlForImages = `${req.protocol}://${req.get("host")}/images/`;
      const productWithFullImageUrls = {
        ...data,
        thumbnail: data.thumbnail
          ? `${baseUrlForImages}${data.thumbnail}`
          : null,
        images: data.images
          ? data.images
              .split(",")
              .map((img) => `${baseUrlForImages}${img.trim()}`)
              .join(",")
          : null,
      };
      res.json(productWithFullImageUrls);
    }
  });
});

app.post(
  "/products/",
  AuthMiddleware,
  [
    // Dilindungi AuthMiddleware
    body("title", "Title has to be filled").notEmpty(),
    body("description", "Description has to be filled").notEmpty(),
    body("brand", "Brand has to be filled").notEmpty(),
    body("category", "Category has to be filled").notEmpty(),
    body("thumbnail", "Thumbnail has to be filled").notEmpty(),
    body("price", "Price has to be filled").notEmpty(),
    body("price", "Price has to be greater than 0").isInt({ min: 0 }),
    body("stock", "Stock has to be filled").notEmpty(),
    body("stock", "Stock has to be greater than 0").isInt({ min: 0 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const data = req.body;
      const insert = `insert into product (title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images) values (?,?,?,?,?,?,?,?,?,?)`;
      const params = [
        data.title,
        data.description,
        data.price,
        data.discountPercentage,
        data.rating,
        data.stock,
        data.brand,
        data.category,
        data.thumbnail,
        data.images,
      ];

      db.run(insert, params, async function (err) {
        if (err) {
          res
            .status(400)
            .json({ status: 400, success: false, error: err.message });
        } else {
          if (this.changes == 0) {
            return res.json({
              status: 200,
              success: false,
              affected: this.changes,
              message: "no data inserted",
              data,
            });
          }
          res.json({
            status: 200,
            success: true,
            affected: this.changes,
            message: "Insert data success",
            data,
          });
        }
      });
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  }
);

app.put(
  "/products/:id",
  AuthMiddleware,
  [
    // Dilindungi AuthMiddleware
    body("title", "Title has to be filled").notEmpty(),
    body("description", "Description has to be filled").notEmpty(),
    body("brand", "Brand has to be filled").notEmpty(),
    body("category", "Category has to be filled").notEmpty(),
    body("thumbnail", "Thumbnail has to be filled").notEmpty(),
    body("price", "Price has to be filled").notEmpty(),
    body("price", "Price has to be greater than 0").isInt({ min: 0 }),
    body("stock", "Stock has to be filled").notEmpty(),
    body("stock", "Stock has to be greater than 0").isInt({ min: 0 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const id = parseInt(req.params.id);
      db.get(`select * from product where id=?`, [id], (err, data) => {
        if (err || !data) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: err?.message || "Data not found",
          });
        } else {
          const data = req.body;
          delete data.id;
          const sql = Object.entries(data)
            .map(([key, value]) => `${key}=?`)
            .join(",");
          const params = Object.entries(data).map(([key, value]) => value);
          params.push(id);
          const update = `update product set ${sql} where id=?`;
          db.run(update, params, async function (err) {
            if (err) {
              res
                .status(400)
                .json({ status: 400, success: false, error: err.message });
            } else {
              if (this.changes == 0) {
                return res.json({
                  status: 200,
                  success: false,
                  affected: this.changes,
                  message: "no data updated",
                  data,
                });
              }
              res.json({
                status: 200,
                success: true,
                affected: this.changes,
                message: "Update data success",
                data,
              });
            }
          });
        }
      });
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  }
);

app.delete("/products/:id", AuthMiddleware, (req, res) => {
  // Dilindungi AuthMiddleware
  const id = parseInt(req.params.id);
  db.run("delete from product where id=?", [id], async function (err) {
    if (err) {
      res.status(400).json({ status: 400, success: false, error: err.message });
    } else {
      if (this.changes == 0) {
        return res.json({
          status: 200,
          success: false,
          affected: this.changes,
          message: "no data deleted",
        });
      }
      res.json({
        status: 200,
        success: true,
        affected: this.changes,
        message: "Delete data success",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});