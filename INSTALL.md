# ⚙️ Sarang — Installation & Configuration Manual

This guide walks you through setting up **Sarang** locally, configuring your environment variables, and initializing your Supabase database.

---

## 📋 Prerequisites
Make sure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher) or **Yarn** / **pnpm**
* A free **Supabase** account
* A free **Resend** account (for contact email routing)

---

## 🚀 Local Installation

Follow these steps to run Sarang on your local machine:

```bash
# 1. Clone the project repository
git clone https://github.com/Saarangggg/nextjs-cinematic-portfolio.git
cd nextjs-cinematic-portfolio

# 2. Install dependencies
npm install

# 3. Create your environment configuration file
# On Windows (Command Prompt / PowerShell):
copy .env.example .env.local
# On macOS / Linux:
cp .env.example .env.local
```

Once you have configured the environment variables and set up the database (see sections below), run the development server:

```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to inspect the application.

---

## 🗄️ Database Setup (Supabase)

Sarang utilizes a relational PostgreSQL database on Supabase. To initialize the tables:

1. Log into your [Supabase Dashboard](https://app.supabase.com/) and create a new project.
2. Select your project, click on **SQL Editor** on the left menu, and click **New Query**.
3. Copy and paste the following SQL script to create the necessary tables (`works`, `blogs`, `comments`, `inquiries`, `settings`, `subscribers`) with their relations:

```sql
-- 1. Create Works Table (Projects)
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  link TEXT,
  client TEXT DEFAULT '',
  month TEXT DEFAULT '',
  year TEXT DEFAULT '',
  services TEXT DEFAULT '',
  review TEXT DEFAULT '',
  logo_full_view_url TEXT DEFAULT '',
  desktop_view_url TEXT DEFAULT '',
  phone_view_url TEXT DEFAULT '',
  mobile_image_url TEXT DEFAULT '',
  mainImageUrl TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  project_id UUID REFERENCES works(id) ON DELETE SET NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visible BOOLEAN DEFAULT true
);

-- 3. Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  email TEXT,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 6. Create Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
4. Click **Run** to execute the query. You should see a green success alert.

---

## ⚙️ Environment Variables (`.env.local`)

Open the `.env.local` file you created in your root folder, and fill in the values below:

| Environment Variable | Description | Where to find / Example |
| :--- | :--- | :--- |
| **`NEXT_PUBLIC_SUPABASE_URL`** | Your Supabase project URL | Supabase Dashboard -> Project Settings -> API |
| **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** | Client anon key | Supabase Dashboard -> Project Settings -> API |
| **`SUPABASE_SERVICE_ROLE_KEY`** | Database administrator key | Supabase Dashboard -> Project Settings -> API |
| **`RESEND_API_KEY`** | API key for routing contact emails | Resend Dashboard -> API Keys (`re_...`) |
| **`ADMIN_PASSWORD`** | Admin panel sign-in password | Set a secure password for `/admin/login` |
| **`JWT_SECRET`** | Random signing token string | Generate using the script below |
| **`ADMIN_EMAIL`** | Target email for contact form alerts | e.g. `yourname@gmail.com` |
| **`NEXT_PUBLIC_SITE_URL`** | The URL of your live site | e.g. `https://your-portfolio.com` |
| **`NEXT_PUBLIC_WHATSAPP_NUMBER`** | Contact phone link destination | Format without `+` (e.g. `919876543210`) |
| **`COMING_SOON_PASSWORD`** | Bypasses Coming Soon landing screen | Passcode to view dev progress |
| **`NEXT_PUBLIC_GOOGLE_VERIFICATION`**| Google Search Console tag | Search Console -> HTML Tag content value |
| **`NEXT_PUBLIC_BING_VERIFICATION`**  | Bing Webmaster Console tag | Webmaster Tools -> Content verification ID |

### 🔑 Generating your `JWT_SECRET`

To generate a secure, cryptographically random `JWT_SECRET` for your `.env.local` file, run the helper script included in the repository root:

```bash
node generate-secret.js
```

Alternatively, you can generate a secret directly in your terminal using this one-liner:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated 64-character hex string and paste it as the value for `JWT_SECRET` in your `.env.local` file.

---

## 🌍 Production Deployments

### Vercel (Recommended)
1. Push your local project to a GitHub, GitLab, or Bitbucket repository.
2. Visit [Vercel](https://vercel.com/new) and log in.
3. Import your project repository.
4. Expand **Environment Variables** and add all variables listed in the `.env.local` table above.
5. Click **Deploy**.

### Manual Server Build
To compile the portfolio for self-hosting or node VPS deployment:
```bash
# Compile and optimize for production
npm run build

# Start production server
npm run start
```
