-- Idempotent schema patch for audit + relations on Neon
-- Run after backend booted once (to seed admin user)

-- Ensure users table exists (created by TypeORM); skip if already there

-- Products: audit columns + size/color relations
ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_id int NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id int NULL,
  ADD COLUMN IF NOT EXISTS active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS size_id int NULL,
  ADD COLUMN IF NOT EXISTS color_id int NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_created_by_fk'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_created_by_fk FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_updated_by_fk'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_size_fk'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_size_fk FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_color_fk'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_color_fk FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Sizes: audit columns + active
ALTER TABLE IF EXISTS sizes
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_id int NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id int NULL,
  ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sizes_created_by_fk'
  ) THEN
    ALTER TABLE sizes
      ADD CONSTRAINT sizes_created_by_fk FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sizes_updated_by_fk'
  ) THEN
    ALTER TABLE sizes
      ADD CONSTRAINT sizes_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Colors: audit columns + active
ALTER TABLE IF EXISTS colors
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_id int NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id int NULL,
  ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'colors_created_by_fk'
  ) THEN
    ALTER TABLE colors
      ADD CONSTRAINT colors_created_by_fk FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'colors_updated_by_fk'
  ) THEN
    ALTER TABLE colors
      ADD CONSTRAINT colors_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Sales: audit columns
ALTER TABLE IF NOT EXISTS sales
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_id int NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id int NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sales_created_by_fk'
  ) THEN
    ALTER TABLE sales
      ADD CONSTRAINT sales_created_by_fk FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sales_updated_by_fk'
  ) THEN
    ALTER TABLE sales
      ADD CONSTRAINT sales_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Sale items: audit columns
ALTER TABLE IF EXISTS sale_items
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_id int NULL,
  ADD COLUMN IF NOT EXISTS updated_by_id int NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sale_items_created_by_fk'
  ) THEN
    ALTER TABLE sale_items
      ADD CONSTRAINT sale_items_created_by_fk FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sale_items_updated_by_fk'
  ) THEN
    ALTER TABLE sale_items
      ADD CONSTRAINT sale_items_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Backfill null audit fields with admin and NOW()
DO $$
DECLARE admin_id int;
BEGIN
  SELECT id INTO admin_id FROM users WHERE username = 'admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    UPDATE products SET created_at = COALESCE(created_at, now()), updated_at = COALESCE(updated_at, now()),
      created_by_id = COALESCE(created_by_id, admin_id), updated_by_id = COALESCE(updated_by_id, admin_id)
      WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL;
    UPDATE sizes SET created_at = COALESCE(created_at, now()), updated_at = COALESCE(updated_at, now()),
      created_by_id = COALESCE(created_by_id, admin_id), updated_by_id = COALESCE(updated_by_id, admin_id)
      WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL;
    UPDATE colors SET created_at = COALESCE(created_at, now()), updated_at = COALESCE(updated_at, now()),
      created_by_id = COALESCE(created_by_id, admin_id), updated_by_id = COALESCE(updated_by_id, admin_id)
      WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL;
    UPDATE sales SET created_at = COALESCE(created_at, now()), updated_at = COALESCE(updated_at, now()),
      created_by_id = COALESCE(created_by_id, admin_id), updated_by_id = COALESCE(updated_by_id, admin_id)
      WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL;
    UPDATE sale_items SET created_at = COALESCE(created_at, now()), updated_at = COALESCE(updated_at, now()),
      created_by_id = COALESCE(created_by_id, admin_id), updated_by_id = COALESCE(updated_by_id, admin_id)
      WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL;
  END IF;
END$$;

