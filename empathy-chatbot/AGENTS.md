# AGENTS.md

## Project Overview

Project ini adalah aplikasi web chatbot empatik bernama **VRED**.  
VRED dikembangkan sebagai teman diskusi virtual berbasis Large Language Model, keyword-based Retrieval-Augmented Generation, safety layer, mood selection, tone adaptation, multi-session chat history, dan response time logging.

Aplikasi dibangun menggunakan:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- OpenAI / LLM API
- JSON knowledge base
- Google Spreadsheet logging melalui Google Apps Script
- localStorage untuk multi-session chat history

## Main Features

1. Landing page VRED.
2. Onboarding pengguna:
   - bahasa
   - nama
   - usia
   - gender
3. Persona chatbot:
   - Prince untuk pengguna perempuan
   - Pricilla untuk pengguna laki-laki
   - VRED untuk mode umum
4. Mood selection:
   - Baik
   - Sedih
   - Marah
   - Cemas
   - Hampa
5. Tone response:
   - Santai / Friendly
   - Marah / Tegas
   - Profesional
6. Keyword-based RAG menggunakan file JSON.
7. Safety layer berbasis rule-based moderation.
8. Response time logging ke Google Spreadsheet.
9. Multi-session chat history menggunakan localStorage.
10. Mobile-friendly responsive UI.

## Important Rules

- Jangan menghapus fitur onboarding.
- Jangan menghapus mood selection.
- Jangan menghapus tone response.
- Jangan menampilkan response time di UI pengguna.
- Response time hanya boleh disimpan ke Google Spreadsheet.
- Jangan mengganti keyword-based RAG menjadi FAISS atau embedding tanpa instruksi eksplisit.
- Jangan menambahkan database server jika tidak diminta.
- Riwayat chat saat ini harus tetap menggunakan localStorage.
- Jangan menyimpan API key langsung di source code.
- Gunakan environment variable untuk data rahasia:
  - OPENAI_API_KEY
  - GOOGLE_SHEET_WEBHOOK_URL

## Coding Rules

- Gunakan TypeScript.
- Gunakan functional component React.
- Gunakan Tailwind CSS untuk styling.
- Jaga agar UI tetap mobile-friendly.
- Jangan membuat perubahan besar tanpa menjaga fitur yang sudah ada.
- Pastikan `npm run build` berhasil sebelum deployment.
- Hindari menampilkan error teknis ke pengguna akhir.
- Gunakan bahasa Indonesia sebagai default, tetapi tetap dukung English sesuai pilihan user.

## RAG Implementation

RAG pada project ini menggunakan pendekatan **keyword-based retrieval**.

Alur:
1. User mengirim pesan.
2. Sistem mencocokkan pesan dengan knowledge base JSON.
3. Konteks relevan diambil dari dokumen JSON.
4. Konteks dimasukkan ke prompt.
5. Prompt dikirim ke LLM.
6. LLM menghasilkan respons.

Jangan menyebut sistem ini menggunakan FAISS, vector database, atau embedding kecuali memang sudah diimplementasikan.

## Safety Layer

Safety layer menggunakan pendekatan rule-based.

Jika input pengguna terindikasi risiko tinggi:
- jangan lanjutkan respons normal,
- berikan respons aman,
- sarankan pengguna menghubungi orang terpercaya atau bantuan profesional,
- jangan memberikan instruksi berbahaya.

## Latency / Response Time

Response time dihitung dari saat request mulai diproses sampai respons selesai dikembalikan.

Response time:
- dicatat di backend,
- dikirim ke Google Spreadsheet,
- tidak ditampilkan di UI.

## Deployment Notes

Project dapat di-deploy ke Netlify atau Vercel.

Pastikan environment variable sudah diatur di platform deployment:
- OPENAI_API_KEY
- GOOGLE_SHEET_WEBHOOK_URL

Jangan commit file:
- .env
- .env.local
- node_modules
- .next