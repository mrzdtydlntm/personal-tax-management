# PPh21 Tax Manager

Indonesian Tax Management System for tracking monthly payslips and calculating PPh21 (Income Tax Article 21) obligations. This application helps you monitor your annual tax liability and determine if you'll receive a refund or need to pay additional taxes.

## 🌟 Features

- **Monthly Payslip Tracking**: Record your monthly gross salary, PPh21 deductions, and take-home pay
- **Automatic Tax Calculation**: Calculate your annual tax liability based on Indonesian progressive tax rates (2024)
- **PTKP Management**: Configure your PTKP (Non-Taxable Income) status
- **Refund/Payment Analysis**: Instantly see if you'll get a refund or owe additional taxes
- **Year Projection**: Project your annual tax based on current monthly data
- **Visual Charts**: Interactive charts showing monthly income and tax deductions
- **PostgreSQL Database**: Production-ready database compatible with NeonDB

## 🏗️ Technology Stack

- **Framework**: Nuxt 3 (Vue.js fullstack framework)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS
- **Charts**: Chart.js with vue-chartjs
- **Runtime**: Node.js v24.13.0
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js v24.13.0 (managed with nvm)
- pnpm package manager
- PostgreSQL database (NeonDB recommended)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Make sure you're using Node v24.13.0
nvm use v24.13.0

# Install dependencies
pnpm install
```

### 2. Database Setup

#### Using NeonDB (Recommended)

1. Go to [NeonDB](https://neon.tech) and create a new project
2. Copy your connection string from the dashboard
3. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

#### Using Local PostgreSQL

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pph21_tax_db?schema=public"
```

### 3. Run Database Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations to create database tables
pnpm prisma:migrate

# (Optional) Open Prisma Studio to view your database
pnpm prisma:studio
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
pph21-tax-manager/
├── assets/
│   └── css/
│       └── main.css              # Global styles with Tailwind
├── components/
│   ├── PayslipForm.vue           # Form to add/edit payslips
│   ├── PayslipList.vue           # Table displaying all payslips
│   ├── TaxChart.vue              # Chart.js visualization
│   └── TaxSummaryCard.vue        # Tax calculation summary
├── layouts/
│   └── default.vue               # Main layout with navigation
├── pages/
│   ├── index.vue                 # Dashboard page
│   ├── payslips.vue              # Payslip management page
│   └── settings.vue              # PTKP settings page
├── prisma/
│   └── schema.prisma             # Database schema
├── server/
│   ├── api/
│   │   ├── payslips/
│   │   │   ├── index.get.ts     # Get all payslips
│   │   │   ├── index.post.ts    # Create payslip
│   │   │   ├── [id].put.ts      # Update payslip
│   │   │   └── [id].delete.ts   # Delete payslip
│   │   ├── tax/
│   │   │   └── calculate.post.ts # Calculate tax
│   │   └── tax-settings/
│   │       ├── index.get.ts     # Get PTKP settings
│   │       └── index.put.ts     # Update PTKP settings
│   └── utils/
│       ├── prisma.ts             # Prisma client singleton
│       └── taxCalculator.ts      # Tax calculation utilities
├── .env                          # Environment variables (create this)
├── .env.example                  # Environment template
├── app.vue                       # Root component
├── nuxt.config.ts                # Nuxt configuration
├── package.json                  # Dependencies
├── prisma/schema.prisma          # Database schema
└── README.md                     # This file
```

## 🗄️ Database Schema

### Payslip Model

Stores monthly payslip information:

```prisma
model Payslip {
  id              String   @id @default(cuid())
  month           Int      // 1-12
  year            Int
  grossSalary     Float    // Gaji bruto
  takeHomePay     Float    // Gaji bersih
  pph21Deducted   Float    // PPh21 dipotong
  otherDeductions Float    // Potongan lain
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([month, year])
}
```

### TaxSettings Model

Stores user's PTKP configuration:

```prisma
model TaxSettings {
  id         String   @id @default(cuid())
  ptkpStatus String   @default("TK/0")
  ptkpAmount Float
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 💰 Indonesian Tax Information (PPh21)

### Progressive Tax Rates (2024)

The application uses the following tax brackets:

| Annual Taxable Income             | Tax Rate |
| --------------------------------- | -------- |
| 0 - Rp 60,000,000                 | 5%       |
| Rp 60,000,000 - Rp 250,000,000    | 15%      |
| Rp 250,000,000 - Rp 500,000,000   | 25%      |
| Rp 500,000,000 - Rp 5,000,000,000 | 30%      |
| Above Rp 5,000,000,000            | 35%      |

### PTKP Values (2024)

PTKP (Penghasilan Tidak Kena Pajak) - Non-Taxable Income:

| Status | Description           | PTKP Amount   |
| ------ | --------------------- | ------------- |
| TK/0   | Single, 0 dependents  | Rp 54,000,000 |
| TK/1   | Single, 1 dependent   | Rp 58,500,000 |
| TK/2   | Single, 2 dependents  | Rp 63,000,000 |
| TK/3   | Single, 3 dependents  | Rp 67,500,000 |
| K/0    | Married, 0 dependents | Rp 58,500,000 |
| K/1    | Married, 1 dependent  | Rp 63,000,000 |
| K/2    | Married, 2 dependents | Rp 67,500,000 |
| K/3    | Married, 3 dependents | Rp 72,000,000 |

## 🧮 Tax Calculation Logic

### How It Works

1. **Collect Annual Income**: Sum of all monthly gross salaries
2. **Subtract PTKP**: `Taxable Income = Annual Gross - PTKP Amount`
3. **Apply Progressive Rates**: Calculate tax using the bracket system
4. **Compare with Deducted PPh21**: `Difference = Total PPh21 Deducted - Actual Tax Liability`

### Example Calculation

```
Annual Gross Salary: Rp 120,000,000
PTKP (TK/0):        -Rp  54,000,000
-----------------------------------
Taxable Income:      Rp  66,000,000

Tax Calculation:
- First Rp 60,000,000 × 5%  = Rp 3,000,000
- Next  Rp  6,000,000 × 15% = Rp   900,000
-----------------------------------
Total Tax Liability:         = Rp 3,900,000

Total PPh21 Deducted:        = Rp 4,500,000
Difference (Refund):         = Rp   600,000
```

## 🔌 API Endpoints

### Payslips

- `GET /api/payslips?year=2024` - Get all payslips for a year
- `POST /api/payslips` - Create a new payslip
- `PUT /api/payslips/:id` - Update a payslip
- `DELETE /api/payslips/:id` - Delete a payslip

### Tax Calculation

- `POST /api/tax/calculate` - Calculate annual tax
  ```json
  {
    "year": 2024,
    "ptkpStatus": "TK/0"
  }
  ```

### Settings

- `GET /api/tax-settings` - Get current PTKP settings
- `PUT /api/tax-settings` - Update PTKP settings
  ```json
  {
    "ptkpStatus": "K/1"
  }
  ```

## 🎨 Code Architecture

### Frontend Architecture

**Component-Based Design**: The application uses Vue 3 composition API with reusable components:

- **PayslipForm**: Handles both create and edit operations with validation
- **PayslipList**: Displays tabular data with CRUD actions
- **TaxSummaryCard**: Shows calculated tax information with status indicators
- **TaxChart**: Visualizes monthly data using Chart.js

**State Management**: Uses Vue's reactive state and composables:

- `ref()` for reactive data
- `computed()` for derived state
- `watch()` for reactive updates

**Routing**: Nuxt's file-based routing:

- `/` - Dashboard
- `/payslips` - Payslip management
- `/settings` - PTKP configuration

### Backend Architecture

**Server API Structure**: Nuxt's built-in server routes with RESTful conventions:

```
server/api/
├── payslips/          # Resource-based routing
│   ├── index.get.ts   # List payslips
│   ├── index.post.ts  # Create payslip
│   ├── [id].put.ts    # Update payslip
│   └── [id].delete.ts # Delete payslip
├── tax/
│   └── calculate.post.ts
└── tax-settings/
    ├── index.get.ts
    └── index.put.ts
```

**Utility Modules**:

1. **prisma.ts**: Singleton pattern for database connection
   - Prevents multiple instances in development
   - Production-ready connection pooling

2. **taxCalculator.ts**: Pure functions for tax calculations
   - `calculateProgressiveTax()`: Applies tax brackets
   - `calculateAnnualTax()`: Full tax calculation with PTKP
   - `calculateMonthlyProjection()`: Projects year-end tax

**Data Flow**:

```
User Input → Vue Component → API Route → Prisma ORM → PostgreSQL
                                ↓
                         Tax Calculator Utils
                                ↓
                         Computed Result → Component → User
```

### Database Design

**Normalized Schema**: Two main entities with clear responsibilities:

1. **Payslip**: Transactional data (monthly records)
   - Unique constraint on `(month, year)` prevents duplicates
   - Indexed on `year` for efficient queries

2. **TaxSettings**: Configuration data (singleton pattern)
   - Stores user's PTKP status
   - Updated infrequently

**Query Optimization**:

- Indexed year field for fast filtering
- Unique constraint prevents duplicate entries
- Minimal joins for better performance

### Security Considerations

1. **Input Validation**: All API routes validate required fields
2. **Type Safety**: TypeScript ensures type correctness
3. **SQL Injection Protection**: Prisma ORM prevents SQL injection
4. **Environment Variables**: Sensitive data stored in `.env`

## 🚀 Deployment

### Build for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- Render
- DigitalOcean App Platform

Make sure to:

1. Set `DATABASE_URL` environment variable
2. Run `pnpm prisma generate` in build step
3. Run `pnpm prisma migrate deploy` for production migrations

## 📝 Usage Guide

### Adding Monthly Payslips

1. Go to **Payslips** page
2. Fill in the form:
   - Month and Year
   - Gross Salary (Gaji Bruto)
   - Take Home Pay (Gaji Bersih)
   - PPh21 Deducted (PPh21 yang dipotong)
   - Other Deductions (optional)
3. Click **Simpan** (Save)

### Configuring PTKP

1. Go to **Settings** page
2. Select your PTKP status
3. Click **Simpan Pengaturan** (Save Settings)

### Viewing Tax Summary

1. Go to **Dashboard**
2. Select year from dropdown
3. View:
   - Annual income summary
   - Tax liability calculation
   - Refund/additional payment status
   - Monthly breakdown chart

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for Indonesian taxpayers**
