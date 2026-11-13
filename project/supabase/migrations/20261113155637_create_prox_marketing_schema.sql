/*
# Prox Marketing Agency — Database Schema

1. New Tables
- `leads` — consultation requests submitted from the contact form (name, phone, service_type, message, status, created_at).
- `pricing` — editable pricing entries for SMM packages and marketing starting price (key, label_uz, label_ru, price, period_uz, period_ru, sort_order).
- `services` — service items for the three pillars SMM / Marketing / IT (pillar, title_uz, title_ru, description_uz, description_ru, icon_name, sort_order).
- `partners` — partner/client logos (name, logo_url, sort_order).

2. Security
- Enable RLS on all tables.
- `leads`: INSERT open to anon (public contact form); SELECT/UPDATE/DELETE restricted to authenticated (admin only).
- `pricing`, `services`, `partners`: SELECT open to anon + authenticated (public display); INSERT/UPDATE/DELETE restricted to authenticated (admin only).
- Grants match policy roles.

3. Seed Data
- Default SMM pricing rows ($1500, $1350, $1200, $1000) and marketing starting price ($2000).
- Default service items for all three pillars.
- A few placeholder partner rows.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('SMM', 'Marketing', 'IT')),
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON leads TO authenticated;

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_leads" ON leads;
CREATE POLICY "auth_select_leads" ON leads FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_leads" ON leads;
CREATE POLICY "auth_update_leads" ON leads FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_leads" ON leads;
CREATE POLICY "auth_delete_leads" ON leads FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label_uz text NOT NULL,
  label_ru text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  period_uz text,
  period_ru text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON pricing TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON pricing TO authenticated;

DROP POLICY IF EXISTS "public_select_pricing" ON pricing;
CREATE POLICY "public_select_pricing" ON pricing FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_pricing" ON pricing;
CREATE POLICY "auth_insert_pricing" ON pricing FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pricing" ON pricing;
CREATE POLICY "auth_update_pricing" ON pricing FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pricing" ON pricing;
CREATE POLICY "auth_delete_pricing" ON pricing FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar text NOT NULL CHECK (pillar IN ('SMM', 'Marketing', 'IT')),
  title_uz text NOT NULL,
  title_ru text NOT NULL,
  description_uz text,
  description_ru text,
  icon_name text NOT NULL DEFAULT 'CheckCircle',
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON services TO authenticated;

DROP POLICY IF EXISTS "public_select_services" ON services;
CREATE POLICY "public_select_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON partners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON partners TO authenticated;

DROP POLICY IF EXISTS "public_select_partners" ON partners;
CREATE POLICY "public_select_partners" ON partners FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_partners" ON partners;
CREATE POLICY "auth_insert_partners" ON partners FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_partners" ON partners;
CREATE POLICY "auth_update_partners" ON partners FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_partners" ON partners;
CREATE POLICY "auth_delete_partners" ON partners FOR DELETE
  TO authenticated USING (true);

-- Seed pricing
INSERT INTO pricing (key, label_uz, label_ru, price, period_uz, period_ru, sort_order) VALUES
  ('smm_1', '1 oylik', '1 месяц', 1500, '/oy', '/мес', 1),
  ('smm_3', '3 oylik paket', 'Пакет на 3 месяца', 1350, '/oy', '/мес', 2),
  ('smm_6', '6 oylik paket', 'Пакет на 6 месяцев', 1200, '/oy', '/мес', 3),
  ('smm_12', '12 oylik (1 yillik) paket', 'Годовой пакет (12 месяцев)', 1000, '/oy', '/мес', 4),
  ('marketing', 'Marketing (boshlang''ich)', 'Маркетинг (от)', 2000, 'dan', 'от', 5)
ON CONFLICT (key) DO NOTHING;

-- Seed services SMM
INSERT INTO services (pillar, title_uz, title_ru, icon_name, sort_order) VALUES
  ('SMM', 'Strategiya ishlab chiqish', 'Разработка стратегии', 'Lightbulb', 1),
  ('SMM', 'Kontent yaratish', 'Создание контента', 'FileText', 2),
  ('SMM', 'Post va storilarni boshqarish', 'Управление постами и сторис', 'LayoutGrid', 3),
  ('SMM', 'Reklama kampaniyalari (Instagram/Facebook)', 'Рекламные кампании (Instagram/Facebook)', 'Megaphone', 4),
  ('SMM', 'Brend imijini mustahkamlash', 'Укрепление имиджа бренда', 'Shield', 5),
  ('SMM', 'Analitika va hisobot', 'Аналитика и отчётность', 'BarChart3', 6);

-- Seed services Marketing
INSERT INTO services (pillar, title_uz, title_ru, icon_name, sort_order) VALUES
  ('Marketing', 'SMM xizmatlaridagi barcha takliflar', 'Все услуги из SMM', 'CheckCircle', 1),
  ('Marketing', 'Target (Google Ads, Telegram Ads)', 'Таргет (Google Ads, Telegram Ads)', 'Target', 2),
  ('Marketing', 'Branding (logo, brandbook)', 'Брендинг (логотип, брендбук)', 'Palette', 3),
  ('Marketing', 'Marketing strategiya & konsalting', 'Маркетинговая стратегия и консалтинг', 'Compass', 4),
  ('Marketing', 'Influencer marketing', 'Инфлюенсер-маркетинг', 'Users', 5),
  ('Marketing', 'Sotuv bo''limi nazorati', 'Контроль отдела продаж', 'TrendingUp', 6);

-- Seed services IT
INSERT INTO services (pillar, title_uz, title_ru, icon_name, sort_order) VALUES
  ('IT', 'Veb-sayt ishlab chiqish (landing, korporativ, internet-do''kon)', 'Разработка веб-сайтов (лендинг, корпоративный, интернет-магазин)', 'Globe', 1),
  ('IT', 'Mobil ilovalar (iOS/Android)', 'Мобильные приложения (iOS/Android)', 'Smartphone', 2),
  ('IT', 'Onlayn buyurtma va to''lov tizimlari', 'Системы онлайн-заказов и платежей', 'CreditCard', 3),
  ('IT', 'UI/UX dizayn', 'UI/UX дизайн', 'PenTool', 4),
  ('IT', 'Texnik qo''llab-quvvatlash', 'Техническая поддержка', 'Headphones', 5),
  ('IT', 'Sun''iy intellekt va botlar (Telegram/Instagram AI chat-botlar)', 'ИИ и боты (Telegram/Instagram AI чат-боты)', 'Bot', 6);

-- Seed partners
INSERT INTO partners (name, logo_url, sort_order) VALUES
  ('Partner One', NULL, 1),
  ('Partner Two', NULL, 2),
  ('Partner Three', NULL, 3),
  ('Partner Four', NULL, 4),
  ('Partner Five', NULL, 5),
  ('Partner Six', NULL, 6)
ON CONFLICT DO NOTHING;
