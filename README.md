# 📘 Izin Acara Backend - GraphQL API

Sistem backend untuk pengelolaan izin acara yang menggunakan autentikasi JWT dan GraphQL API. Role pengguna terdiri dari:

* **Operator**: Membuat dan mengelola event
* **Verifikator**: Memverifikasi event dari operator dengan `kode_unit` yang sama
* **Public**: Dapat melihat event yang sudah diverifikasi

---

## 🛠 Tech Stack

* **Node.js** v20.x
* **Express.js** v4.19.2
* **Apollo Server** v4.7.5
* **GraphQL** v16.8.1
* **Mongoose (MongoDB ODM)** v8.3.2
* **JWT (jsonwebtoken)** v9.0.1
* **bcryptjs** v2.4.3
* **dotenv** v16.3.1



##  Setup & Installation

# 1. Clone repository
$ git clone <repo_url>
$ cd BE

# 2. Install dependencies
$ npm install

# 3. Jalankan server
$ npm run dev

Server berjalan di: `http://localhost:4000/graphql`


##  Environment Variables

Buat file `.env` di root proyek dengan isi:

PORT=4000
MONGO_URI=mongodb://localhost:27017/izin-acara
JWT_SECRET=your_secret_key


##  Database Setup

Pastikan MongoDB sudah aktif dan database `izin-acara` akan otomatis dibuat saat koneksi pertama.

Untuk testing login/verifikasi,  bisa menambahkan data awal:

###  Insert Akun Operator dan Verifikator

{
  "username": "operator1",
  "password": "$2b$10$zK8Bz0qDR2Vu.IO6QQjIuOpHSKynvYBYD2ck4BSmY6udIkivmMjum",
  "role": "OPERATOR",
  "kode_unit": "JAKARTA_01"
}

{
  "username": "verifikator1",
  "password": "$2b$10$zK8Bz0qDR2Vu.IO6QQjIuOpHSKynvYBYD2ck4BSmY6udIkivmMjum",
  "role": "VERIFIKATOR",
  "kode_unit": "JAKARTA_01"
}

> Password di atas adalah hash dari `123456`


##  API Documentation (GraphQL Studio Sandbox)

Akses di: `http://localhost:4000/graphql`

###  Login (All Roles)

mutation {
  login(input: { username: "operator1", password: "123456" }) {
    token
    user {
      id
      role
    }
  }
}


###  Create Event (Operator only)

mutation {
  createEventPermission(input: {
    nama_acara: "Seminar AI",
    penyelenggara: "UNDIP",
    jumlah_peserta: 100,
    tanggal_mulai: "2025-08-01",
    tanggal_selesai: "2025-08-02",
    lokasi: "Gedung Serba Guna, Undip",
    provinsi_id: 33,
    kota_id: 3374
  }) {
    id
    nama_acara
  }
}


###  Verifikasi Event (Verifikator, same kode\_unit)

mutation {
  verifyEventPermission(id: "<event_id>") {
    id
    verified_by
  }
}


###  Query Event Terverifikasi (Public Access)

query {
  getVerifiedEventPermissions {
    nama_acara
    lokasi
    verified_at
  }
}


> Gunakan **tab HTTP Headers** di Studio Sandbox:

{
  "authorization": "Bearer <TOKEN_LOGIN>"
}

