# PPh21 Tax Manager - Code Architecture

## Overview

This document provides a comprehensive overview of the application's architecture, design decisions, and code organization.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Vue 3 (Composition API) | Reactive UI components |
| Framework | Nuxt 3 | Fullstack framework with SSR/SSG |
| Styling | TailwindCSS | Utility-first CSS |
| Charts | Chart.js + vue-chartjs | Data visualization |
| Backend | Nuxt Server Routes | RESTful API endpoints |
| Database | PostgreSQL | Production-ready RDBMS |
| ORM | Prisma | Type-safe database client |
| Runtime | Node.js v24.13.0 | JavaScript runtime |
| Package Manager | pnpm | Fast, disk space efficient |

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (Vue Components, Pages, Layouts, TailwindCSS)              │
├─────────────────────────────────────────────────────────────┤
│                     Application Layer                        │
│  (Nuxt Server Routes, API Handlers, Business Logic)         │
├─────────────────────────────────────────────────────────────┤
│                     Data Access Layer                        │
│  (Prisma ORM, Database Queries, Models)                     │
├─────────────────────────────────────────────────────────────┤
│                     Database Layer                           │
│  (PostgreSQL/NeonDB)                                        │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure Explained

### `/components` - Reusable Vue Components

**Purpose**: Encapsulated, reusable UI components

```
components/
├── PayslipForm.vue       # Form component for add/edit operations
├── PayslipList.vue       # Table component with CRUD actions
├── TaxChart.vue          # Chart.js visualization wrapper
└── TaxSummaryCard.vue    # Tax calculation display
```

**Design Pattern**: Single Responsibility Principle
- Each component handles one specific UI concern
- Props-down, events-up communication pattern
- Composition API for better code organization

#### PayslipForm.vue
```
Responsibilities:
- Form state management
- Input validation
- Create/Update operations
- Error handling
- Success callbacks

Props:
- title: Form heading
- initialData: For edit mode
- showCancel: Toggle cancel button

Events:
- @success: Emitted after successful save
- @cancel: Emitted when user cancels
```

#### PayslipList.vue
```
Responsibilities:
- Display tabular data
- Calculate totals
- Handle delete operations
- Format currency
- Month name translation

Props:
- payslips: Array of payslip objects
- year: Current year filter

Events:
- @edit: Emit payslip for editing
- @delete: Trigger deletion
- @refresh: Request data reload
```

#### TaxSummaryCard.vue
```
Responsibilities:
- Fetch tax calculation from API
- Display tax breakdown
- Show refund/payment status
- Display projections
- Auto-refresh on prop changes

Props:
- year: Tax calculation year
- ptkpStatus: PTKP status

Exposed Methods:
- refresh(): Manually trigger reload
```

#### TaxChart.vue
```
Responsibilities:
- Initialize Chart.js
- Render bar chart
- Format currency tooltips
- Handle data updates
- Cleanup on unmount

Props:
- payslips: Array of payslip data
```

### `/layouts` - Page Layouts

**Purpose**: Shared page structure

```
layouts/
└── default.vue           # Main layout with navigation
```

**Features**:
- Responsive navigation bar
- Active link highlighting
- Year indicator
- Footer
- Max-width container (7xl)

### `/pages` - Route Pages

**Purpose**: File-based routing pages

```
pages/
├── index.vue             # Dashboard (/)
├── payslips.vue          # Payslip management (/payslips)
└── settings.vue          # PTKP settings (/settings)
```

**Routing Convention**: Nuxt's file-based routing
- `index.vue` → `/`
- `payslips.vue` → `/payslips`
- `settings.vue` → `/settings`

#### index.vue (Dashboard)
```
Features:
- Year filter selector
- Tax summary display
- Interactive chart
- Payslip list
- Tax brackets reference table

State:
- selectedYear: Year filter
- payslips: Payslip data
- ptkpStatus: User's PTKP status

Lifecycle:
- onMounted: Fetch initial data
- watch(selectedYear): Reload on year change
```

#### payslips.vue
```
Features:
- Add new payslip form
- Edit existing payslip
- Year filter
- Payslip list

State:
- selectedYear: Year filter
- payslips: Payslip data
- editingPayslip: Current editing record

Query Params:
- ?edit=<id>: Load payslip in edit mode
```

#### settings.vue
```
Features:
- PTKP status selector
- PTKP information table
- Database info
- Save settings

State:
- selectedPtkp: Current PTKP status
- loading: Save state
- success/error: Feedback messages
```

### `/server/api` - Backend API Routes

**Purpose**: RESTful API endpoints using Nuxt server routes

```
server/api/
├── payslips/
│   ├── index.get.ts      # GET /api/payslips?year=2024
│   ├── index.post.ts     # POST /api/payslips
│   ├── [id].put.ts       # PUT /api/payslips/:id
│   └── [id].delete.ts    # DELETE /api/payslips/:id
├── tax/
│   └── calculate.post.ts # POST /api/tax/calculate
└── tax-settings/
    ├── index.get.ts      # GET /api/tax-settings
    └── index.put.ts      # PUT /api/tax-settings
```

**RESTful Convention**:
- `GET` for reading
- `POST` for creating
- `PUT` for updating
- `DELETE` for deleting

**Error Handling Pattern**:
```typescript
throw createError({
  statusCode: 400,
  message: 'Validation error message'
})
```

#### Payslips API

**GET /api/payslips**
```typescript
Query: { year?: number }
Returns: Payslip[]
Purpose: Fetch all payslips for a year
```

**POST /api/payslips**
```typescript
Body: {
  month: number,
  year: number,
  grossSalary: number,
  takeHomePay: number,
  pph21Deducted: number,
  otherDeductions?: number
}
Returns: Payslip
Validations:
  - Required fields check
  - Month range (1-12)
  - Duplicate check (month + year)
```

**PUT /api/payslips/:id**
```typescript
Params: { id: string }
Body: Partial<PayslipData>
Returns: Payslip
Purpose: Update existing payslip
```

**DELETE /api/payslips/:id**
```typescript
Params: { id: string }
Returns: { success: true }
Purpose: Delete payslip
```

#### Tax API

**POST /api/tax/calculate**
```typescript
Body: {
  year: number,
  ptkpStatus: string
}
Returns: {
  year: number,
  payslipsCount: number,
  totalTakeHomePay: number,
  annualGrossIncome: number,
  ptkpAmount: number,
  ptkpStatus: string,
  taxableIncome: number,
  actualTaxLiability: number,
  totalPph21Deducted: number,
  difference: number,
  status: 'REFUND' | 'ADDITIONAL_PAYMENT' | 'EXACT',
  effectiveTaxRate: number,
  projection?: {
    projectedAnnualGross: number,
    projectedAnnualPph21: number,
    avgMonthlyGross: number,
    avgMonthlyPph21: number,
    remainingMonths: number
  },
  monthlyBreakdown: Array<{
    month: number,
    grossSalary: number,
    pph21Deducted: number,
    takeHomePay: number
  }>
}
```

#### Tax Settings API

**GET /api/tax-settings**
```typescript
Returns: TaxSettings
Purpose: Get current PTKP settings (creates default if not exists)
```

**PUT /api/tax-settings**
```typescript
Body: { ptkpStatus: string }
Returns: TaxSettings
Purpose: Update PTKP settings
```

### `/server/utils` - Backend Utilities

**Purpose**: Shared server-side utilities

```
server/utils/
├── prisma.ts             # Prisma Client singleton
└── taxCalculator.ts      # Tax calculation logic
```

#### prisma.ts - Database Client
```typescript
Pattern: Singleton
Purpose:
  - Single Prisma Client instance
  - Prevents connection pool exhaustion
  - Development hot-reload friendly
  - Production-ready

Implementation:
  - Global variable in development
  - New instance in production
  - TypeScript type safety
```

#### taxCalculator.ts - Tax Logic
```typescript
Pure Functions:
  - calculateProgressiveTax(income): Apply tax brackets
  - calculateAnnualTax(gross, ptkp, deducted): Full calculation
  - getTaxBracketInfo(income): Get bracket details
  - calculateMonthlyProjection(data, month): Project year-end

Constants:
  - PTKP_VALUES: 2024 PTKP amounts
  - TAX_BRACKETS: Progressive tax rates

Design:
  - Pure functions (no side effects)
  - Easy to test
  - Can be reused in frontend
```

**Tax Calculation Algorithm**:
```
1. Calculate Taxable Income
   taxableIncome = annualGross - PTKP

2. Apply Progressive Brackets
   For each bracket:
     - Determine income in bracket
     - Multiply by bracket rate
     - Sum all bracket taxes

3. Compare with Deducted
   difference = totalDeducted - actualTax

4. Determine Status
   if difference > 0: REFUND
   if difference < 0: ADDITIONAL_PAYMENT
   else: EXACT
```

### `/prisma` - Database Schema

**Purpose**: Database model definitions

```
prisma/
└── schema.prisma         # Prisma schema file
```

#### schema.prisma

**Generator**: Prisma Client for TypeScript

**Datasource**: PostgreSQL (NeonDB compatible)

**Models**:

1. **Payslip**
```prisma
Purpose: Monthly payslip records

Fields:
  - id: CUID primary key
  - month: 1-12
  - year: Year
  - grossSalary: Gaji bruto
  - takeHomePay: Gaji bersih
  - pph21Deducted: PPh21 dipotong
  - otherDeductions: Potongan lain
  - createdAt: Timestamp
  - updatedAt: Auto-update timestamp

Indexes:
  - @@unique([month, year]): Prevent duplicates
  - @@index([year]): Fast year filtering

Design Decisions:
  - CUID for distributed ID generation
  - Unique constraint prevents duplicate months
  - Float for currency (PostgreSQL numeric)
  - Indexed year for query performance
```

2. **TaxSettings**
```prisma
Purpose: User's PTKP configuration (singleton)

Fields:
  - id: CUID primary key
  - ptkpStatus: Status code (TK/0, K/1, etc)
  - ptkpAmount: PTKP value
  - createdAt: Timestamp
  - updatedAt: Auto-update timestamp

Design:
  - Single row expected (singleton pattern)
  - Updated infrequently
  - Denormalized ptkpAmount for performance
```

## Data Flow

### Add Payslip Flow
```
User Input (PayslipForm.vue)
  ↓
  Vue reactive state
  ↓
  Form validation
  ↓
  POST /api/payslips (index.post.ts)
  ↓
  Server validation
  ↓
  Prisma.payslip.create()
  ↓
  PostgreSQL INSERT
  ↓
  Return created record
  ↓
  Component emits @success
  ↓
  Parent refreshes data
  ↓
  UI updates
```

### Tax Calculation Flow
```
User visits Dashboard
  ↓
  TaxSummaryCard.vue mounts
  ↓
  watch() triggers on props
  ↓
  POST /api/tax/calculate
  ↓
  Fetch payslips from DB
  ↓
  Calculate totals
  ↓
  taxCalculator.calculateAnnualTax()
  ↓
  Apply PTKP and brackets
  ↓
  Calculate projection (if incomplete year)
  ↓
  Return calculation results
  ↓
  Component displays results
  ↓
  UI shows refund/payment status
```

## Design Patterns

### 1. Component Composition
- Small, focused components
- Props down, events up
- Composition over inheritance

### 2. Singleton Pattern
- Prisma Client instance
- Tax Settings (database)

### 3. Repository Pattern
- Prisma abstracts data access
- Business logic separate from queries

### 4. RESTful API
- Resource-based endpoints
- HTTP verbs for actions
- Predictable URL structure

### 5. Pure Functions
- Tax calculations
- No side effects
- Easily testable

## State Management

**Approach**: Local component state (no Vuex/Pinia)

**Rationale**:
- Application is simple enough
- No complex shared state
- Direct API communication
- Component-level reactivity sufficient

**State Locations**:
- Component `ref()`/`reactive()` for UI state
- Database for persistent state
- Computed properties for derived state

## Performance Considerations

### Database
- Indexed `year` field for fast filtering
- Unique constraints prevent duplicates
- Connection pooling (Prisma)
- Efficient queries (no N+1)

### Frontend
- Computed properties for derived data
- Chart.js canvas rendering
- Component lazy loading (automatic with Nuxt)
- TailwindCSS purging (production)

### API
- Direct database queries (no unnecessary layers)
- Minimal data transformation
- Efficient aggregations

## Security

### Database
- Prisma prevents SQL injection
- Parameterized queries
- Type-safe operations

### API
- Input validation on all endpoints
- Error messages don't leak sensitive data
- CORS handled by Nuxt

### Environment
- Sensitive data in .env
- .gitignore protects credentials
- Environment variables required

## Testing Strategy

### Unit Tests (Recommended)
- Tax calculation functions
- Pure utility functions
- Component logic

### Integration Tests (Recommended)
- API endpoints
- Database operations
- Full user flows

### E2E Tests (Optional)
- Critical user paths
- Form submissions
- Navigation

## Deployment Considerations

### Environment Variables
```
DATABASE_URL=postgresql://...
NODE_ENV=production
```

### Build Steps
```bash
1. pnpm install
2. pnpm prisma generate
3. pnpm prisma migrate deploy
4. pnpm build
```

### Database Migrations
- Never run `prisma migrate dev` in production
- Use `prisma migrate deploy` instead
- Backup database before migrations

### Monitoring
- Database connection health
- API response times
- Error rates
- User sessions

## Scalability

### Current Limits
- Single database (vertical scaling)
- No caching layer
- No CDN for assets

### Scale-Up Path
1. **Database**: Connection pooling (PgBouncer)
2. **Caching**: Redis for computed values
3. **CDN**: Static assets (Vercel Edge)
4. **Load Balancing**: Multiple instances
5. **Read Replicas**: Database reads

### Expected Performance
- 100-1000 users: Current architecture sufficient
- 1000-10000 users: Add caching, CDN
- 10000+ users: Load balancing, replicas

## Future Enhancements

### Potential Features
1. Multi-user support with authentication
2. File upload for bulk payslip import
3. PDF report generation
4. Email notifications
5. Budget planning tools
6. Investment tracking
7. SPT form pre-filling

### Technical Improvements
1. Unit test coverage
2. E2E test suite
3. Error tracking (Sentry)
4. Analytics (Plausible)
5. Performance monitoring
6. CI/CD pipeline
7. Docker containerization

## Code Style

### TypeScript
- Explicit types for API responses
- Inferred types for variables
- Interfaces for complex objects

### Vue
- Composition API (not Options API)
- `<script setup>` syntax
- Single File Components (.vue)

### CSS
- TailwindCSS utilities
- Component-scoped styles only when needed
- Responsive design (mobile-first)

### Naming Conventions
- camelCase for variables/functions
- PascalCase for components
- kebab-case for file names (routes)
- UPPER_CASE for constants

## Documentation

### Code Comments
- Only for complex logic
- Explain "why", not "what"
- TypeScript types are self-documenting

### API Documentation
- JSDoc for utility functions
- Request/response examples
- Error codes and messages

## Maintenance

### Dependencies
- Regular updates (monthly)
- Security patches (immediate)
- Breaking changes (plan carefully)

### Database
- Regular backups
- Migration history in git
- Schema changes reviewed

### Monitoring
- Error logs
- Performance metrics
- User feedback

---

**This architecture is designed to be:**
- ✅ Simple to understand
- ✅ Easy to maintain
- ✅ Scalable when needed
- ✅ Production-ready
- ✅ Developer-friendly
