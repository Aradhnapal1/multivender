-- Banner placement support (PostgreSQL)
-- Run this on the same DB used by /api/banner endpoints.

START TRANSACTION;

-- 1) Add placement column (top/middle/bottom)
ALTER TABLE banners
ADD COLUMN IF NOT EXISTS placement VARCHAR(20) NOT NULL DEFAULT 'top';

-- 1b) Enforce allowed values
ALTER TABLE banners
DROP CONSTRAINT IF EXISTS banners_placement_check;

ALTER TABLE banners
ADD CONSTRAINT banners_placement_check
CHECK (placement IN ('top', 'middle', 'bottom'));

-- 2) Optional: keep old data as top by default
UPDATE banners
SET placement = 'top'
WHERE placement IS NULL OR placement = '';

-- 3) Helpful index for homepage rendering filters
CREATE INDEX IF NOT EXISTS idx_banners_placement_isactive
ON banners (placement, "isActive");

COMMIT;

-- Verification
-- SELECT id, title, link, placement, "isActive" FROM banners ORDER BY id DESC;
