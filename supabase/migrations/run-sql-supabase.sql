-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ad_clicks (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  label text NOT NULL,
  url text DEFAULT ''::text,
  page text DEFAULT ''::text,
  CONSTRAINT ad_clicks_pkey PRIMARY KEY (id)
);

CREATE TABLE public.inquiries (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  CONSTRAINT inquiries_pkey PRIMARY KEY (id)
);

CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  tech text,
  photo_url text,
  link text,
  review text,
  num text,
  sort_order integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  gallery jsonb DEFAULT '[]'::jsonb,
  client text NOT NULL DEFAULT ''::text,
  month text NOT NULL DEFAULT ''::text,
  year text NOT NULL DEFAULT ''::text,
  logo_full_view_url text NOT NULL DEFAULT ''::text,
  desktop_view_url text NOT NULL DEFAULT ''::text,
  phone_view_url text NOT NULL DEFAULT ''::text,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

CREATE TABLE public.reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  author text NOT NULL,
  role text DEFAULT ''::text,
  company text DEFAULT ''::text,
  content text NOT NULL,
  rating smallint DEFAULT 5,
  approved boolean DEFAULT true,
  avatar text DEFAULT ''::text,
  CONSTRAINT reviews_pkey PRIMARY KEY (id)
);

CREATE TABLE public.searches (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  query text NOT NULL,
  count bigint DEFAULT 1,
  last_searched timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT searches_pkey PRIMARY KEY (id)
);

CREATE TABLE public.settings (
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT 'false'::jsonb,
  CONSTRAINT settings_pkey PRIMARY KEY (key)
);

CREATE TABLE public.subscribers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscribers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.visits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT '/'::text,
  referrer text NOT NULL DEFAULT ''::text,
  useragent text NOT NULL DEFAULT ''::text,
  ip text NOT NULL DEFAULT ''::text,
  country text NOT NULL DEFAULT ''::text,
  city text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT ''::text,
  CONSTRAINT visits_pkey PRIMARY KEY (id)
);

CREATE TABLE public.works (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT ''::text,
  category text NOT NULL DEFAULT 'Website'::text,
  tech text DEFAULT ''::text,
  image_url text DEFAULT ''::text,
  link text DEFAULT ''::text,
  sort_order integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  client text DEFAULT ''::text,
  year text DEFAULT ''::text,
  services text DEFAULT ''::text,
  month text NOT NULL DEFAULT ''::text,
  logo_full_view_url text NOT NULL DEFAULT ''::text,
  desktop_view_url text NOT NULL DEFAULT ''::text,
  phone_view_url text NOT NULL DEFAULT ''::text,
  gallery jsonb DEFAULT '[]'::jsonb,
  review text DEFAULT ''::text,
  mobile_image_url text DEFAULT ''::text,
  mainimageurl text DEFAULT ''::text,
  CONSTRAINT works_pkey PRIMARY KEY (id)
);

-- ── STORAGE BUCKETS ──

-- Create projects storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for projects bucket
-- Allows anyone to view project images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'projects');

-- Allows authenticated uploads (admin only if RLS is configured correctly)
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'projects');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'projects');
