# Divisionsracet

Pedagogiskt spel i React + Vite + TypeScript dar spelaren svarar pa divisionsfragor under tidspress.
Snabbare korrekta svar ger fler poang. Highscorelistan visas bredvid spelplanen och sparas i Supabase efter varje runda.

## 1) Installera och starta lokalt

```bash
npm install
cp .env.example .env
npm run dev
```

## 2) Konfigurera Supabase

1. Oppna ditt projekt i Supabase.
2. Gå till SQL Editor och kor detta:

```sql
create extension if not exists pgcrypto;

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(player_name) between 2 and 20),
  score integer not null check (score >= 0),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0),
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;

create policy "Allow read scores"
on public.scores
for select
to anon
using (true);

create policy "Allow insert scores"
on public.scores
for insert
to anon
with check (true);
```

3. Gå till Project Settings -> API och kopiera:
   - Project URL
   - anon public key
4. Fyll i `.env`:

```env
VITE_SUPABASE_URL=din_project_url
VITE_SUPABASE_ANON_KEY=din_anon_key
```

## 3) Poangmodell

- Baspoang per ratt svar: `100`
- Tidsgranser per fraga: `10` sekunder
- Bonus: `max(0, floor((10 - svarstidSek) * 20))`
- Exempel: svar pa 2.1 sek ger cirka 258 totalpoang.

## 4) GitHub push (befintligt repo)

Byt `GITHUB_REPO_URL` till din URL:

```bash
git init
git add .
git commit -m "Build division speed game with Supabase highscores"
git branch -M main
git remote add origin GITHUB_REPO_URL
git push -u origin main
```

Om du redan har `origin` satt:

```bash
git remote set-url origin GITHUB_REPO_URL
git push -u origin main
```

## 5) Manuell verifiering

- Snabbare ratt svar ger hogre poang an langsamma.
- Highscorelistan laddas nar sidan oppnas.
- Efter avslutad runda kan namn + poang sparas.
- Ny sparad poang syns i listan direkt efter lyckad sparning.
