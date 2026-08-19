# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Server

ni adalah ide proyek yang sangat solid dan sesuai dengan kriteria yang diminta. Membuat aplikasi Public Real-time Chat dengan AI Summarization akan sangat menonjolkan kemampuan Anda dalam menangani state management dan real-time communication.

Berikut adalah struktur lengkap untuk proyek Anda:

1. Arsitektur & Teknologi (Tech Stack)
   Berdasarkan syarat pada gambar, kita akan menggunakan:

Client: Vite + React.js (SPA), React Context (State Management), Tailwind CSS, Socket.io-client.

Server: Node.js + Express, Socket.io, Cloudinary SDK, Google Generative AI (Gemini).

Database: PostgreSQL atau MongoDB (untuk menyimpan history chat).

2. Entity Relationship Diagram (ERD) - Konsep Sederhana
   Karena ini adalah public chat sederhana, kita hanya butuh struktur minimal:
   Tabel: Users,Tabel: Messages
   id (PK),id (PK)
   username,user_id (FK)
   avatar_url (Cloudinary),content (Text)
   created_at,image_url (Optional - Cloudinary)
   ,created_at

3. Struktur Folder (Project Structure)
   Client (Frontend)
   src/
   ├── components/ # ChatBubble, ChatInput, Sidebar, Navbar
   ├── context/ # ChatContext.jsx (State Management Utama)
   ├── hooks/ # useSocket.js
   ├── pages/ # ChatPage, LandingPage
   ├── services/ # api.js (Axios config)
   └── App.jsx

server/
├── controllers/ # aiController.js, chatController.js
├── models/ # Database schemas
├── routes/ # apiRoutes.js
├── socket/ # socketHandler.js (Logika Real-time)
└── index.js # Server entry point

4. Endpoint API & Socket Events
   REST API (Express)
   GET /api/messages: Mengambil 10-20 chat terakhir dari database.

POST /api/ai/summarize: Mengirimkan history chat ke Gemini AI dan mengembalikan rangkuman teks.

POST /api/upload: Upload gambar ke Cloudinary (jika user ingin kirim gambar di chat).

Socket.io Events
connection: User terhubung ke server.

send-message: Client mengirim pesan baru.

receive-message: Server menyebarkan (broadcast) pesan ke semua user yang online.

5. Fitur Utama & Halaman
   Halaman (Pages):
   Landing Page: Form sederhana untuk memasukkan username dan memilih avatar (upload via Cloudinary).

Chat Room: Area utama. Menampilkan bubble chat, list user online, dan tombol "AI Summarize".

Fitur AI (Gemini Integration):
Anda bisa membuat sebuah tombol "Rangkum Percakapan". Saat diklik:

Frontend mengambil history chat yang ada di state/context.

Kirim teks tersebut ke backend.

Backend meminta Gemini AI dengan prompt: "Rangkum percakapan berikut dalam 3 poin singkat: [History Chat]".

Hasilnya ditampilkan di modal atau chat bubble khusus AI.

6. Package yang Dibutuhkan
   Client side:
   npm install socket.io-client axios react-router-dom cloudinary-react lucide-react

Server side:
npm install express socket.io @google/generative-ai cloudinary dotenv cors

Tips Tambahan untuk Group Project Anda:
State Management: Gunakan React Context untuk menyimpan data user (username, avatar) dan daftar pesan yang sedang berlangsung agar sinkron di seluruh komponen.

Deployment: Pastikan URL server di-set sebagai environment variable di client (Vite) agar socket tidak error saat dideploy.

Apakah Anda ingin saya buatkan contoh kode dasar untuk ChatContext menggunakan React Context agar sesuai dengan requirement nomor 5?
