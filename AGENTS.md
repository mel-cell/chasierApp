# CHASIER APP V2 — AI Agent Guide

## 🎯 Project Overview

Sistem kasir (POS) untuk bisnis kuliner/restoran yang dijalankan di **localhost (1 PC)**. Owner dapat mengakses laporan via **remote desktop (AnyDesk)**.

---

## 🏗️ Tech Stack

| Komponen | Teknologi |
|---|---|
| Backend | Laravel 12 (PHP 8.2+) |
| Database | MySQL (Docker — container `mysqldb`) |
| Frontend | React 19 + Inertia.js 3 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Build Tool | Vite 7 |
| Auth | PIN-based (6 digit) |
| Export | PhpSpreadsheet (Excel) |
| Chart | Chart.js |
| Package Manager | pnpm (Node) + Composer (PHP) |

---

## 🗃️ Database Schema

### Table: `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | Auto increment |
| name | varchar | Nama user |
| pin | varchar(6) | PIN 6 digit (unique) |
| email | varchar | Email (unique) |
| email_verified_at | timestamp nullable | |
| password | varchar | Password hash |
| role | enum | owner, kasir, inventoris |
| is_active | boolean | Aktif/tidak |
| remember_token | varchar nullable | |
| deleted_at | timestamp nullable | Soft deletes |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `warehouses`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | varchar | Nama gudang |
| user_id | bigint FK nullable | PIC (penanggung jawab) |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `ingredients`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | varchar | Nama bahan |
| unit | varchar | Satuan (gram, ml, pcs, dll) |
| min_stock | decimal(10,2) | Stok minimum |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `warehouse_ingredients`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| warehouse_id | bigint FK | |
| ingredient_id | bigint FK | |
| stock | decimal(10,2) | Stok di gudang ini |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | varchar | Nama kategori |
| deleted_at | timestamp nullable | Soft deletes |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `menus`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| category_id | bigint FK nullable | |
| name | varchar | Nama menu |
| price | decimal(12,2) | Harga jual |
| image | varchar nullable | Path gambar |
| is_active | boolean | |
| deleted_at | timestamp nullable | Soft deletes |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `menu_ingredients`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| menu_id | bigint FK | |
| ingredient_id | bigint FK | |
| quantity | decimal(10,2) | Takaran per porsi |
| unit | varchar | Satuan |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `payment_methods`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | varchar | Tunai, Non Tunai |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `transactions`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK | Kasir |
| payment_method_id | bigint FK | |
| total_amount | decimal(12,2) | Total belanja |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `transaction_details`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| transaction_id | bigint FK | |
| menu_id | bigint FK | |
| quantity | integer | Jumlah |
| price | decimal(12,2) | Harga satuan |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `inventory_logs`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| ingredient_id | bigint FK | |
| warehouse_id | bigint FK | |
| user_id | bigint FK | |
| type | enum | in, out |
| quantity | decimal(10,2) | |
| reason | varchar nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: `settings`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| key | varchar (unique) | inventoris_active, resep_active |
| value | varchar nullable | true/false |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 👥 User Roles & PINs (Seeder)

| Role | Name | PIN | Email |
|---|---|---|---|
| Owner | Lintang | `123456` | owner@gmail.com |
| Kasir | Kasir 1 | `111111` | kasir1@gmail.com |
| Inventoris | Inventoris 1 | `222222` | inventoris1@gmail.com |

---

## 📄 Halaman & Routes

| Route | Method | Halaman | Middleware |
|---|---|---|---|
| `/` | GET | Login PIN (Inertia: `auth/Login`) | none |
| `/auth/login` | POST | Login action (AuthController) | none |
| `/logout` | POST | Logout | none |
| `/admin/dashboard` | GET | Admin Dashboard (analytics) | `role:owner` |
| `/admin/users` | GET/POST/PATCH/DELETE | Management User | `role:owner` |
| `/admin/categories` | GET/POST/PATCH/DELETE | Management Kategori | `role:owner` |
| `/admin/menus` | GET/POST/PATCH/DELETE | Management Menu | `role:owner` |
| `/admin/warehouses` | GET/POST/PATCH/DELETE | Management Gudang | `role:owner` |
| `/admin/ingredients` | GET/POST/PATCH/DELETE | Management Bahan | `role:owner` |
| `/admin/stock` | GET/POST | Management Stok (in/out/adjust) | `role:owner` |
| `/admin/resep` | GET/POST/PATCH/DELETE | Resep (MenuIngredient) | `role:owner` |
| `/admin/laporan` | GET | Laporan Transaksi & Stok | `role:owner` |
| `/admin/laporan/export` | GET | Export Excel | `role:owner` |
| `/admin/settings` | GET/POST | Settings (toggle inventoris/resep) | `role:owner` |
| `/kasir/dashboard` | GET/POST | POS Kasir | `role:kasir` |
| `/kasir/profile` | GET/POST | Profile Kasir | `role:kasir` |
| `/kasir/settings` | GET/POST | Settings Kasir | `role:kasir` |
| `/inventoris/dashboard` | GET | Inventoris Dashboard (analytics) | `role:inventoris` |
| `/inventoris/laporan` | GET | Laporan Stok | `role:inventoris` |
| `/inventoris/laporan/export` | GET | Export Excel Stok | `role:inventoris` |

---

## 🔄 Auth Flow

```
/ → Login.tsx (input PIN)
  → POST /auth/login → cek users.pin & is_active
  → success → redirect ke dashboard sesuai role
  → fail → kembali ke login dengan error
```

## 📁 Struktur Frontend

```
resources/js/
├── page/
│   ├── Welcome.tsx                          # Splash screen
│   ├── auth/Login.tsx                       # PIN login form
│   ├── admin/
│   │   ├── Dashboard.tsx                    # Admin dashboard (analytics + chart)
│   │   ├── Users.tsx                        # Management user (CRUD + soft delete)
│   │   ├── Categories.tsx                   # Management kategori
│   │   ├── Menus.tsx                        # Management menu + image upload
│   │   ├── Warehouses.tsx                   # Management gudang + PIC
│   │   ├── Ingredients.tsx                  # Management bahan
│   │   ├── Stock.tsx                        # Stok in/out/adjust per gudang
│   │   ├── Resep.tsx                        # Resep (menu ↔ ingredient)
│   │   ├── Laporan.tsx                      # Laporan transaksi & stok + export
│   │   └── Settings.tsx                     # Toggle modul inventoris/resep
│   ├── kasir/
│   │   ├── dashboard.tsx                    # POS transaksi (real data from server)
│   │   ├── Profile.tsx                      # Profil kasir (edit nama/email/PIN)
│   │   └── Settings.tsx                     # Pengaturan kasir (cetak/tampilan)
│   └── inventoris/
│       └── Dashboard.tsx                    # Inventoris dashboard (chart + log)
├── components/ui/                           # shadcn/ui components
├── lib/utils.ts
├── app.tsx                                  # Inertia bootstrap
└── bootstrap.ts
```

## ⚙️ Inertia Shared Data

Tersedia di `usePage().props.auth`:
```ts
{
    user: {
        id: number,
        name: string,
        role: string,
        email: string,
    } | null
}
```

## ⚠️ Aturan AI Agent

### Wajib
1. Cek file yang ada sebelum buat baru
2. Migration harus backward compatible
3. Relasi didefinisikan di Model (bukan DB query langsung di Controller)
4. Route pakai named route
5. View pakai React component + Inertia (BUKAN Blade)
6. Controller pakai dependency injection
7. Gunakan Form Request untuk validasi
8. Jangan hardcode URL — pakai `route()` helper

### Dilarang
1. ❌ Jangan pakai Breeze/Jetstream/Sanctum — auth PIN custom
2. ❌ Jangan pakai Blade view — semua frontend React + Inertia
3. ❌ Jangan skip validasi input
4. ❌ Jangan hardcode path/URL
5. ❌ Jangan pakai `DB::raw()` tanpa parameter binding
6. ❌ Jangan commit .env

### Model Naming Convention
| Indonesia (AGENTS lama) | Inggris (Sekarang) | Tabel |
|---|---|---|
| Gudang | Warehouse | warehouses |
| Bahan | Ingredient | ingredients |
| Stok Gudang | WarehouseIngredient | warehouse_ingredients |
| Resep | MenuIngredient | menu_ingredients |
| Log Stok | InventoryLog | inventory_logs |
| Detail Transaksi | TransactionDetail | transaction_details |
| Metode Bayar | PaymentMethod | payment_methods |
| Kategori | Category | categories |
| Menu | Menu | menus |
| Transaksi | Transaction | transactions |
| User | User | users |
| Setting | Setting | settings |

## 🚀 Build Order

| # | Modul | Status |
|---|---|---|
| 1 | Setup .env + Docker MySQL | ✅ |
| 2 | Migration + Seeder | ✅ |
| 3 | Auth PIN + Middleware Role | ✅ |
| 4 | Frontend Login (React) | ✅ |
| 5 | Admin Dashboard + Management User | ✅ |
| 6 | Management Kategori + Menu | ✅ |
| 7 | Management Ingredient + Stok | ✅ |
| 8 | Resep (MenuIngredient) + toggle | ✅ |
| 9 | POS Kasir (transaksi) | ✅ |
| 10 | Dashboard Inventoris | ✅ |
| 11 | Dashboard Admin (analytic) | ✅ |
| 12 | Laporan + Export Excel | ✅ |
| 13 | Settings (toggle inventoris/resep) | ✅ |

## 🔑 Catatan Penting

- **Docker MySQL**: container `mysqldb`, port `3306`, root password `root`, database `chasier_app`
- **Auth**: PIN-based (6 digit), tanpa email/password login
- **Frontend**: React + Inertia.js — jangan buat Blade views baru
- **Role dashboard**: masing-masing role punya dashboard sendiri yang diproteksi middleware
