# Database Migration Guide - Add File URL Column

## What Changed

Added a new optional `fileUrl` field to the Payslip model to store links to payslip documents (PDFs, images, Google Drive links, etc.).

## Migration Steps

### 1. Generate Prisma Client

```bash
pnpm prisma generate
```

### 2. Create and Apply Migration

```bash
pnpm prisma:migrate
```

When prompted for migration name, enter: `add_file_url_to_payslip`

This will:

- Add the `fileUrl` column to the `Payslip` table
- Set it as nullable (optional field)
- Update existing records with NULL values

### 3. Verify Migration

```bash
# Open Prisma Studio to verify
pnpm prisma:studio
```

Check that the `fileUrl` column appears in the Payslip table.

## Alternative: Manual Migration (if needed)

If you need to run the migration manually:

```sql
-- Add fileUrl column to Payslip table
ALTER TABLE "Payslip" ADD COLUMN "fileUrl" TEXT;
```

## Rollback (if needed)

If you need to remove this column:

```sql
-- Remove fileUrl column
ALTER TABLE "Payslip" DROP COLUMN "fileUrl";
```

Then regenerate Prisma client:

```bash
pnpm prisma generate
```

## Testing

After migration, test the feature:

1. Go to `/payslips` page
2. Add a new payslip with a file URL
3. Verify the link appears in the table
4. Click the link to open in new tab
5. Edit an existing payslip to add a file URL

## What's New

### Database Schema

- Added `fileUrl String?` field to Payslip model

### API Endpoints

- POST `/api/payslips` now accepts `fileUrl` parameter
- PUT `/api/payslips/:id` now accepts `fileUrl` parameter

### UI Components

- PayslipForm: New input field for file URL
- PayslipList: New column showing file links

## Notes

- The field is optional (can be empty)
- Accepts any valid URL
- Opens in new tab when clicked
- Shows "Lihat" (View) button with file icon
- Shows "-" if no file URL is set
