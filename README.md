# 🚀 rest_api_flutter_localserver - Backend Lokal untuk Aplikasi Flutter E-commerce

---

Selamat datang di repositori **rest_api_flutter_localserver**! 👋

Folder ini didedikasikan untuk menyediakan **backend API lokal** yang akan berinteraksi dengan aplikasi Flutter e-commerce Anda. Backend ini dibangun dengan Node.js dan menggunakan SQLite sebagai databasenya, dirancang khusus untuk memenuhi kebutuhan HTTP request dari proyek Flutter Anda.

---

## ✨ Gambaran Umum & Tujuan

Tujuan utama folder ini adalah sebagai simulasi server API RESTful lokal, memungkinkan Anda untuk:

* Mengembangkan dan menguji aplikasi Flutter Anda tanpa ketergantungan pada server eksternal.
* Memahami alur komunikasi antara aplikasi Flutter (frontend) dan server (backend) menggunakan HTTP requests.
* Bereksperimen dengan operasi CRUD (Create, Read, Update, Delete) pada data produk.

---

## 📂 Struktur Folder Proyek

Proyek backend ini memiliki struktur yang sederhana dan mudah dipahami:

rest_api_flutter_localserver/
├── src/
│   ├── database/
│   │   └── sqlite.js      # Konfigurasi dan inisialisasi database SQLite
│   └── index.js           # File utama backend (server Express.js dan endpoint API)
└── package.json           # Dependensi proyek Node.js
└── README.md              # File ini


---

## 🛠️ Teknologi yang Digunakan

Backend ini dibangun dengan teknologi berikut:

* **[Node.js](https://nodejs.org/)**
    * Lingkungan runtime JavaScript open-source dan cross-platform yang memungkinkan Anda menjalankan kode JavaScript di luar browser. Ini adalah fondasi server lokal kita.
* **[Express.js](https://expressjs.com/)**
    * Kerangka kerja aplikasi web Node.js yang cepat, tidak opiniated, dan minimalis, digunakan untuk membangun API RESTful.
* **[SQLite](https://www.sqlite.org/index.html)**
    * Sistem manajemen database relasional (RDBMS) yang mandiri, tanpa server, tanpa konfigurasi, dan transaksional. Ideal untuk proyek lokal dan prototipe cepat.
* **[Postman](https://www.postman.com/)**
    * Platform kolaborasi API terkemuka yang digunakan untuk merancang, membangun, menguji, dan mendokumentasikan API. Sangat penting untuk menguji endpoint API lokal ini.

---

## ⚙️ Memulai Server Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan server API lokal Anda:

1.  **Pastikan Node.js Terinstal:**
    Jika belum, unduh dan instal Node.js dari [situs resminya](https://nodejs.org/). Anda bisa memverifikasinya dengan menjalankan:
    ```bash
    node -v
    npm -v
    ```

2.  **Masuk ke Direktori Proyek Backend:**
    ```bash
    cd rest_api_flutter_localserver
    ```

3.  **Instal Dependensi:**
    Jalankan perintah berikut untuk menginstal semua paket Node.js yang dibutuhkan (tercantum di `package.json`):
    ```bash
    npm install
    ```

4.  **Jalankan Server:**
    Setelah semua dependensi terinstal, Anda bisa memulai server dengan:
    ```bash
    node src/index.js
    ```
    Anda akan melihat pesan di konsol yang menunjukkan server telah berjalan, biasanya pada `http://localhost:3000` (atau port lain yang Anda konfigurasi di `index.js`).

---

## 🧪 Menguji API dengan Postman

Setelah server berjalan, Anda dapat menggunakan Postman untuk menguji endpoint API yang tersedia:

1.  Buka **Postman**.
2.  Buat **Request** baru (GET, POST, PUT, DELETE, dll.).
3.  Masukkan URL endpoint API (misalnya, `http://localhost:3000/api/products`).
4.  Kirim request dan periksa responsnya.

(Sertakan contoh endpoint jika Anda punya, misalnya `/api/products` untuk GET semua produk, `/api/products/:id` untuk GET detail produk, dll.)

---

## 💡 Konfigurasi Tambahan

* **Port Server**: Anda dapat mengubah port server di `src/index.js` jika perlu.
* **Database**: Database SQLite akan dibuat secara otomatis jika belum ada saat server pertama kali dijalankan. Anda dapat melihat `src/database/sqlite.js` untuk detail skema database.

---

**Jangan ragu untuk memberikan bintang pada repositori ini jika Anda merasa proyek ini bermanfaat!** ✨
