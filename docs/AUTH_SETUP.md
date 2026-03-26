# Authentication Setup Guide

## 🔐 Security Features

The application is now protected with JWT-based authentication featuring:

- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **HTTP-Only Cookies** - Tokens stored in secure cookies
- ✅ **7-Day Sessions** - Tokens valid for 7 days
- ✅ **Password Protection** - Single password for entire app
- ✅ **Automatic Redirect** - Unauthenticated users sent to login
- ✅ **Global Protection** - All pages and API routes protected
- ✅ **Logout Functionality** - Secure session termination

## 📋 Setup Steps

### 1. Install Dependencies (Already Done)

```bash
pnpm add jsonwebtoken bcrypt
pnpm add -D @types/jsonwebtoken @types/bcrypt
```

### 2. Configure Environment Variables

Create/update your `.env` file:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` and set these values:

```env
# Database (already configured)
DATABASE_URL="postgresql://..."

# Authentication - CHANGE THESE!
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
APP_PASSWORD="YourSecurePasswordHere123!"
```

#### Generate Secure JWT Secret

```bash
# Generate a random 64-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Set Your Password

Choose a strong password and set it in `APP_PASSWORD`. This is the password users will enter to access the application.

**Example:**

```env
APP_PASSWORD="MySecure2024Password!"
```

### 3. Restart the Application

```bash
# Stop the current dev server (Ctrl+C)
# Start again
pnpm dev
```

## 🎯 How It Works

### Login Flow

```
1. User visits any page → Redirects to /login
2. User enters password
3. Server validates password
4. Server generates JWT token
5. Token stored in HTTP-only cookie
6. User redirected to dashboard
7. Token valid for 7 days
```

### Authentication Check

```
1. User accesses page/API
2. Middleware checks cookie for token
3. Token verified with JWT_SECRET
4. Valid → Access granted
5. Invalid/Missing → Redirect to /login
```

### Logout Flow

```
1. User clicks Logout button
2. POST to /api/auth/logout
3. Cookie cleared (maxAge: 0)
4. Redirect to /login
```

## 🔑 API Endpoints

### POST `/api/auth/login`

**Request:**

```json
{
  "password": "YourSecurePasswordHere123!"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**

```json
{
  "statusCode": 401,
  "message": "Invalid password"
}
```

### POST `/api/auth/logout`

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET `/api/auth/check`

**Response:**

```json
{
  "authenticated": true
}
```

## 🛡️ Security Features

### 1. HTTP-Only Cookies

- Token stored in cookie that JavaScript cannot access
- Prevents XSS attacks from stealing tokens

### 2. Secure Flag (Production)

- Cookies only sent over HTTPS in production
- Prevents man-in-the-middle attacks

### 3. SameSite Protection

- `SameSite: strict` prevents CSRF attacks
- Cookie only sent from same domain

### 4. Token Expiration

- Tokens expire after 7 days
- Users must re-login after expiration

### 5. Server-Side Validation

- All API routes check authentication
- Middleware protects all endpoints

### 6. Global Route Protection

- Frontend middleware redirects unauthenticated users
- Cannot bypass by URL manipulation

## 📁 File Structure

```
├── server/
│   ├── utils/
│   │   └── auth.ts                 # Auth utilities (JWT, password)
│   ├── middleware/
│   │   └── auth.ts                 # API route protection
│   └── api/
│       └── auth/
│           ├── login.post.ts       # Login endpoint
│           ├── logout.post.ts      # Logout endpoint
│           └── check.get.ts        # Auth check endpoint
├── middleware/
│   └── auth.global.ts              # Frontend route protection
├── pages/
│   └── login.vue                   # Login page
└── layouts/
    └── default.vue                 # Added logout button
```

## 🎨 Login Page Features

- 🎨 Beautiful gradient background
- 🔒 Lock icon and branding
- 👁️ Password visibility toggle
- ⚡ Loading state during login
- ❌ Error messages for invalid password
- ♿ Keyboard accessible
- 📱 Mobile responsive

## 🔧 Customization

### Change Session Duration

Edit `server/utils/auth.ts`:

```typescript
export function generateToken(): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d' // Change to 30 days
  })
}
```

And update cookie maxAge in `server/api/auth/login.post.ts`:

```typescript
setCookie(event, 'auth_token', token, {
  maxAge: 60 * 60 * 24 * 30 // 30 days
})
```

### Add Multiple Users

Currently single password. To add multiple users:

1. Create a User model in Prisma
2. Store hashed passwords with bcrypt
3. Update `verifyPassword()` to check database
4. Add user registration endpoint

### Change Password

1. Update `APP_PASSWORD` in `.env`
2. Restart application
3. All users must login again with new password

## 🐛 Troubleshooting

### "Invalid password" but password is correct

**Solution:** Check `.env` file:

- Ensure `APP_PASSWORD` is set
- No extra spaces or quotes
- Restart dev server after changing

### Infinite redirect loop

**Solution:**

- Check `JWT_SECRET` is set in `.env`
- Clear browser cookies
- Check browser console for errors

### Cookie not being set

**Solution:**

- Check `NODE_ENV` setting
- In production, ensure `secure: true` and HTTPS
- Check browser allows cookies

### Token expired

**Solution:**

- Normal after 7 days
- Just login again
- To extend, change `expiresIn` in auth.ts

## 📊 Testing

### Test Login

1. Visit `http://localhost:3000`
2. Should redirect to `/login`
3. Enter password from `.env`
4. Should redirect to dashboard

### Test Protected Routes

1. After login, visit any page
2. Should work normally
3. Logout
4. Try to visit page
5. Should redirect to login

### Test API Protection

```bash
# Without auth - should fail
curl http://localhost:3000/api/payslips

# With auth - should work
curl http://localhost:3000/api/payslips \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

### Test Logout

1. Login to application
2. Click "Logout" button
3. Should redirect to login
4. Try to go back to dashboard
5. Should redirect to login again

## 🚀 Production Deployment

### Environment Variables

Ensure these are set in production:

```env
NODE_ENV=production
JWT_SECRET="long-random-secret-min-64-chars"
APP_PASSWORD="VeryStrongProductionPassword123!"
DATABASE_URL="postgresql://..."
```

### Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong APP_PASSWORD
- [ ] Enable HTTPS
- [ ] Set `secure: true` for cookies
- [ ] Don't commit `.env` to git
- [ ] Use environment variables in hosting platform
- [ ] Test login/logout flow
- [ ] Test API protection
- [ ] Monitor failed login attempts

## 🔐 Best Practices

1. **Strong Password**
   - Minimum 12 characters
   - Mix of upper/lower/numbers/symbols
   - Not dictionary words

2. **Secure JWT Secret**
   - Minimum 32 characters
   - Random and unique
   - Never share or commit to git

3. **Regular Updates**
   - Change password periodically
   - Update dependencies regularly
   - Monitor security advisories

4. **Backup Access**
   - Keep backup of `.env` file securely
   - Document password in secure location
   - Test recovery procedures

## 📱 Mobile Access

The login page is fully responsive:

- Works on phones and tablets
- Touch-friendly inputs
- Proper viewport scaling
- Auto-focus on password field

## ❓ FAQ

**Q: Can I add multiple passwords?**
A: Currently single password. Can be extended to multi-user.

**Q: How to reset password if forgotten?**
A: Update `APP_PASSWORD` in `.env` and restart server.

**Q: Is this secure enough for production?**
A: Yes, for single-user confidential app. For multi-user, add user database.

**Q: Can I use Google/Facebook login?**
A: Can be added with OAuth providers (future enhancement).

**Q: Does logout work on all devices?**
A: Logout only clears cookie on current device/browser.

---

**Your app is now secure! 🔒**
