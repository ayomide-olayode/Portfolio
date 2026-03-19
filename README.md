
# Modern Portfolio — Ayomide Olayode

A high-performance, developer-focused portfolio website with a full admin panel. Built with Next.js 16, TypeScript, Tailwind CSS, and Firebase.

---

## 🚀 Features

- **Responsive Design**: Optimized for all devices, from desktop to mobile.
- **Dynamic Project Showcase**: Projects are fetched dynamically from Cloud Firestore.
- **Admin Dashboard**: Full CRUD capabilities for managing projects and site content.
- **Frosted Glass UI**: Clean, modern aesthetic inspired by Apple and Linear.
- **Premium Animations**: Fluid transitions and interactive elements powered by Framer Motion.
- **Contact Integration**: Simple and effective contact form.
- **SEO Optimized**: Built-in SEO best practices with metadata and sitemap support.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Backend | [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage) |
| Components | [Radix UI](https://www.radix-ui.com/) |

---

## 🏁 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ayomide-olayode/Portfolio.git
cd Portfolio
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project.
2. Enable **Authentication** → Email/Password.
3. Enable **Firestore** → Start in production mode.
4. Enable **Storage** → Start in production mode.
5. Go to Project Settings → Your apps → Add web app → Copy config.

### 3. Configure environment variables

Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firestore and Storage rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Firestore + Storage, use existing project)
firebase init

# Deploy rules
firebase deploy --only firestore:rules,storage
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

```
app/
  page.tsx                  # Homepage
  layout.tsx                # Root layout (fonts, metadata, header/footer)
  not-found.tsx             # 404 page
  loading.tsx               # Global loading skeleton
  global-error.tsx          # Error boundary
  sitemap.ts                # Auto-generated sitemap
  robots.ts                 # robots.txt
  projects/
    page.tsx                # All projects listing
    [slug]/page.tsx         # Project detail
  contact/page.tsx          # Contact page
  admin/
    layout.tsx              # Admin shell (auth-guarded sidebar)
    page.tsx                # Dashboard
    login/page.tsx          # Login form
    projects/
      page.tsx              # Projects table (list, delete)
      new/page.tsx          # Create project
      [id]/page.tsx         # Edit project
    site-links/page.tsx     # Manage GitHub/LinkedIn/CV URLs

components/
  layout/                   # Header, Footer
  sections/                 # Homepage sections (Hero, SelectedWork, etc.)
  project/                  # ProjectCard
  admin/                    # ProjectForm, AuthGuard
  shared/                   # ThemeProvider

lib/
  firebase/client.ts        # Firebase initialization
  queries/index.ts          # Firestore read functions
  actions/index.ts          # Server actions (write operations)
  utils/index.ts            # cn(), generateSlug(), formatDate()

types/index.ts              # All TypeScript interfaces
```

---

## 🔒 Security

- All `/admin/*` routes are protected by middleware + client-side Firebase auth verification.
- Firestore rules enforce admin-only writes using UID lookup in `admin_users`.
- Storage rules mirror Firestore — public reads, admin-only writes.

---

## 📄 License

MIT

Built with ❤️ by [Ayomide Olayode](https://github.com/ayomide-olayode)
```