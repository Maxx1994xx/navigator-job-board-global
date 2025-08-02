-- Clean up blogs with empty slugs and fix any existing data
UPDATE blogs 
SET slug = CASE 
    WHEN slug IS NULL OR slug = '' THEN 
        LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
                    '\s+', '-', 'g'
                ),
                '-+', '-', 'g'
            )
        )
    ELSE slug
END
WHERE slug IS NULL OR slug = '';

-- Delete any test blogs that might be causing issues
DELETE FROM blogs WHERE title = 'test' AND content = 'test';