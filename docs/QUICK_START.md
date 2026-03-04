# 🚀 Quick Start Guide - PPh21 Tax Manager

## ⚡ TL;DR - Get Running in 5 Minutes

```bash
# 1. Use correct Node version
nvm use v24.13.0

# 2. Install dependencies (already done)
pnpm install

# 3. Setup database connection
cp .env.example .env
# Edit .env and add your NeonDB connection string

# 4. Setup database
pnpm prisma generate
pnpm prisma:migrate

# 5. Start development server
pnpm dev

# 6. Open http://localhost:3000
```

## 🗂️ File Structure Overview

```
📦 pph21-tax-manager
│
├── 📱 Frontend (Vue 3 + Nuxt 3)
│   ├── app.vue                    # Root component
│   ├── layouts/default.vue        # Main layout
│   ├── pages/
│   │   ├── index.vue             # Dashboard
│   │   ├── payslips.vue          # Payslip management
│   │   └── settings.vue          # PTKP settings
│   └── components/
│       ├── PayslipForm.vue       # Add/edit form
│       ├── PayslipList.vue       # Data table
│       ├── TaxChart.vue          # Visualization
│       └── TaxSummaryCard.vue    # Tax display
│
├── 🔧 Backend (Nuxt Server API)
│   └── server/
│       ├── api/
│       │   ├── payslips/         # CRUD endpoints
│       │   ├── tax/              # Calculation endpoint
│       │   └── tax-settings/     # Settings endpoints
│       └── utils/
│           ├── prisma.ts         # DB client
│           └── taxCalculator.ts  # Tax logic
│
└── 🗄️ Database (PostgreSQL + Prisma)
    └── prisma/schema.prisma      # Schema definition
```

## 🎯 Common Commands

### Development
```bash
pnpm dev                    # Start dev server (http://localhost:3000)
pnpm build                  # Build for production
pnpm preview                # Preview production build
```

### Database
```bash
pnpm prisma:migrate         # Run migrations (creates tables)
pnpm prisma:studio          # Open visual database editor
pnpm prisma generate        # Regenerate Prisma Client
```

### Maintenance
```bash
pnpm install                # Install dependencies
pnpm update                 # Update dependencies
```

## 🔑 Key Features

| Feature | Location | Description |
|---------|----------|-------------|
| Dashboard | `/` | View tax summary, charts, and payslips |
| Add Payslip | `/payslips` | Enter monthly payslip data |
| Edit Payslip | `/payslips?edit=<id>` | Update existing payslip |
| Settings | `/settings` | Configure PTKP status |
| Tax Calc | Auto | Automatic calculation on dashboard |

## 📝 Usage Flow

1. **Configure PTKP** (First time only)
   - Go to Settings → Select your PTKP status → Save

2. **Add Monthly Payslips**
   - Go to Payslips → Fill form → Save
   - Add data for each month you have

3. **View Tax Summary**
   - Go to Dashboard → See your tax calculation
   - View if you'll get refund or owe taxes

## 🗃️ Database Models

### Payslip
```
- id: Unique identifier
- month: 1-12
- year: Year (e.g., 2024)
- grossSalary: Gaji bruto
- takeHomePay: Gaji bersih
- pph21Deducted: PPh21 dipotong
- otherDeductions: BPJS, etc.
```

### TaxSettings
```
- id: Unique identifier
- ptkpStatus: TK/0, K/1, etc.
- ptkpAmount: PTKP value
```

## 🌐 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/payslips?year=2024` | Get payslips |
| POST | `/api/payslips` | Create payslip |
| PUT | `/api/payslips/:id` | Update payslip |
| DELETE | `/api/payslips/:id` | Delete payslip |
| POST | `/api/tax/calculate` | Calculate tax |
| GET | `/api/tax-settings` | Get PTKP settings |
| PUT | `/api/tax-settings` | Update PTKP |

## 💡 Tips

### Database Connection
For **NeonDB**:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"
```

For **Local PostgreSQL**:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/pph21_tax_db"
```

### Development Workflow
1. Make changes to code
2. Nuxt auto-reloads (hot module replacement)
3. Test in browser
4. Commit changes

### Production Deployment
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Add `DATABASE_URL` environment variable
4. Deploy!

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `PORT=3001 pnpm dev` |
| Database error | Check `.env` file exists with DATABASE_URL |
| Prisma error | Run `pnpm prisma generate` |
| Module not found | Run `pnpm install` |
| Node version wrong | Run `nvm use v24.13.0` |

## 📚 Documentation

- **README.md** - Full feature documentation
- **ARCHITECTURE.md** - Code architecture deep-dive
- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Project overview

## 💰 Indonesian Tax Rates (2024)

| Annual Income | Tax Rate |
|---------------|----------|
| 0 - 60 juta | 5% |
| 60 - 250 juta | 15% |
| 250 - 500 juta | 25% |
| 500 juta - 5 M | 30% |
| > 5 M | 35% |

## 🎓 PTKP Values (2024)

| Status | Amount |
|--------|--------|
| TK/0 | Rp 54.000.000 |
| TK/1 | Rp 58.500.000 |
| K/0 | Rp 58.500.000 |
| K/1 | Rp 63.000.000 |
| K/2 | Rp 67.500.000 |
| K/3 | Rp 72.000.000 |

## 🎯 Quick Links

- [Nuxt 3 Docs](https://nuxt.com)
- [Prisma Docs](https://prisma.io)
- [Vue 3 Docs](https://vuejs.org)
- [TailwindCSS Docs](https://tailwindcss.com)
- [NeonDB Dashboard](https://neon.tech)

---

**Need Help?** Check SETUP.md or ARCHITECTURE.md for detailed guides!
