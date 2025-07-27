# ✨ Kio Chat — Modern, Secure & Stylish Chat Platform ✨

![Kio Chat Banner](public/img/kio-chat-logo.png)

> **Kio Chat** is a next-generation chat app built with bleeding-edge web tech, beautiful gradients, and a focus on privacy, security, and fun. 
> _Powered by Next.js 15, Prisma, PostgreSQL, Auth.js, Tailwind CSS, and more._

---

## 🚀 Features at a Glance

- **Modern UI/UX**: Animated gradients, dark mode, responsive design, accessible navigation
- **Authentication**: Email/password & Discord OAuth (Auth.js)
- **User Management**: Email verification, avatars, secure sessions
- **Chat System**: 1:1 chat (groups coming soon), message history, file uploads (10MB, JPEG/PNG/PDF/DOCX/MP3/WAV)
- **End-to-End Encryption**: Planned, see InfoCard for roadmap
- **API**: REST endpoints for chat, auth, stats, GitHub info
- **Notifications**: Toasts with sound, email notifications
- **PWA**: Service Worker for offline support (planned)
- **Legal Compliance**: Privacy, Terms, Imprint pages (EN/DE)
- **Stats**: Live GitHub stars, uptime, and more
- **Docker & Vercel Ready**: Easy local dev & cloud deploy

---

## 🛠️ Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Prisma ORM** (PostgreSQL)
- **Auth.js** (Credentials & Discord OAuth)
- **Tailwind CSS** (with custom gradients)
- **Vercel** (for deployment)
- **Nodemailer** (email verification)
- **Service Worker** (PWA support)
- **Docker** (local dev & DB)

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/KibaOfficial/kio-chat.git
cd kio-chat
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Copy the example file and fill in your secrets:
```bash
cp .env.example .env
```
Edit `.env` and set your database, Auth, Discord, and email credentials.

### 4. Set Up the Database
Make sure PostgreSQL is running and credentials in `.env` are correct.
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

### Deploy on Vercel
1. Push your code to GitHub.
2. Create a new project on [Vercel](https://vercel.com/).
3. Add your environment variables in the Vercel dashboard.
4. Deploy!

### Docker (Local Dev)
- Use `docker-compose.yaml` for local DB and service orchestration.

### Custom Production
- Set all required environment variables in your production environment.
- Use `npm run build` and `npm start` for production.

---

## 🗂️ Project Structure

```
kio-chat/
├── prisma/           # Prisma schema & migrations
├── public/           # Static assets (icons, images, sounds)
├── src/
│   ├── app/          # Next.js app directory (routes, API, pages)
│   ├── components/   # React components (UI, modals, providers)
│   ├── lib/          # Utilities, Prisma client, auth logic
│   └── schemas/      # Zod schemas
├── .env.example      # Example environment variables
├── docker-compose.yaml
├── package.json
└── README.md
```

---

## 💬 API Endpoints

- `POST /api/auth` — Authentication (NextAuth.js)
- `POST /api/chat` — Chat creation & management
- `GET  /api/github` — GitHub repo stats
- `GET  /api/stats` — App & GitHub stats

---

## 🗄️ Database Schema (Prisma)

- **User**: Handles user accounts, OAuth, sessions
- **Chat**: 1:1 and group chats
- **Message**: Chat messages
- **VerificationToken**: Email verification
- **ChatUser**: User-chat relationship

See `prisma/schema.prisma` for details.

---

## 🎨 UI/UX Highlights

- **Animated gradients** and glassmorphism
- **Accessible**: Keyboard navigation, focus states
- **Custom toasts** with sound
- **Responsive**: Mobile, tablet, desktop
- **Legal pages**: Privacy, Terms, Imprint (EN/DE)
- **Loading & error states**: Custom, beautiful

---

## 📝 Example Environment Variables

```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DATABASE_URL=
PRISMA_DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

---

## 🧩 Notable Files

- `src/app/layout.tsx` — Global providers, Toaster, ModalProvider
- `src/components/core/Header.tsx`, `Footer.tsx`, `InfoCard.tsx`
- `src/components/app/chat-sidebar.tsx` — Chat navigation
- `src/components/modals/createChat.tsx` — New chat modal
- `src/lib/auth/*` — Auth logic (tokens, mail, verify)
- `src/app/api/*` — API routes (auth, chat, stats, github)
- `src/lib/prisma.ts` — Prisma client
- `src/lib/user/current-profile.ts` — User profile util
- `src/app/(main)/(routes)/(site)/layout.tsx` — Suspense boundary for useSearchParams
- `public/sw.js` — Service worker

---

## 🛡️ Security & Privacy

- Passwords hashed with bcryptjs
- Email verification required
- End-to-end encryption (planned)
- Rate limiting & error handling in API
- GDPR-compliant legal pages

---

## 🌟 Roadmap

- [ ] Group chats
- [ ] End-to-end encryption
- [ ] Custom stickers & reactions
- [ ] PWA offline support
- [ ] More OAuth providers
- [ ] Admin dashboard

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

> _Made with ❤️ by KibaOfficial. Powered by Next.js, Prisma, and the open source community._