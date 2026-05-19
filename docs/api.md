# ΛOMI Editorial - API Documentation

The REST API is versioned under `/api/v1/` with a JSON-first response structure.

## Base URL
```
http://localhost:3001/api/v1
```

---

## Authentication (`/auth`)

| Method | Endpoint | Description | Validation |
|:---|:---|:---|:---|
| **GET** | `/auth/csrf` | Issue secure CSRF token (Public) | None |
| **POST** | `/auth/login` | Authenticate credentials and receive cookies (Public) | `LoginSchema` |
| **POST** | `/auth/register` | Register new client account (Public) | `RegisterSchema` |
| **POST** | `/auth/refresh-token` | Rotate JWT token and issue fresh cookie (Public) | None |
| **POST** | `/auth/verify-email/send` | Trigger verification email mailer (Public) | `SendVerificationEmailSchema` |
| **POST** | `/auth/verify-email` | Verify email via URL crypt token (Public) | `VerifyEmailSchema` |
| **POST** | `/auth/forgot-password` | Request password reset token mailer (Public) | `ForgotPasswordSchema` |
| **POST** | `/auth/reset-password` | Reset password using crypt token (Public) | `ResetPasswordSchema` |
| **POST** | `/auth/logout` | Invalidate active session and clear cookies (Auth) | None |

---

## User Account Profiles (`/users`)

| Method | Endpoint | Description | Details |
|:---|:---|:---|:---|
| **GET** | `/users/me` | Fetch active user's credentials (Auth/Unverified) | Returns roles & verified status |
| **PUT** | `/users/profile` | Update account details (Auth) | `UpdateProfileSchema` |
| **POST** | `/users/avatar` | Upload and set profile avatar picture (Auth) | Multer file payload |

---

## Photographer Profiles (`/photographers`)

| Method | Endpoint | Description | Details |
|:---|:---|:---|:---|
| **GET** | `/photographers/browse` | Fetch active photographers with query filtering (Public) | Browse/search photographers |
| **POST** | `/photographers/create` | Register photographer studio details (Auth) | `CreatePhotographerProfileSchema` |
| **GET** | `/photographers/profile` | Fetch active user's photographer profile details (Auth) | Developer dashboard backend |
| **PATCH** | `/photographers/update` | Update pricing, specialties, location, and bio (Auth) | `UpdatePhotographerProfileSchema` |
| **GET** | `/photographers/:username` | Fetch specific photographer profile by username (Public) | Catch-all dynamic routing |

---

## Portfolio Gallery (`/portfolio`)

| Method | Endpoint | Description | Details |
|:---|:---|:---|:---|
| **GET** | `/portfolio/:photographerId` | Fetch list of portfolio photos (Public) | Dynamic gallery showcase |
| **POST** | `/portfolio/upload` | Securely upload to Cloudinary and link to profile (Auth) | `UploadPortfolioImageSchema` |
| **PATCH** | `/portfolio/:itemId/purpose` | Update the portfolio item context or hero purpose (Auth) | `SetPortfolioItemPurposeSchema` |
| **POST** | `/portfolio/reorder` | Bulk update layout reordering for Bento Editor (Auth) | Array payload of ordered IDs |
| **DELETE** | `/portfolio` | Bulk delete multiple selected images (Auth) | `DeletePortfolioItemsSchema` |

---

## Pre-architected Non-MVP Endpoints
To focus entirely on profile presentation and portfolio quality for the initial release, booking and review endpoints are fully pre-architected but decoupled inside `backend/src/routes/notINmvp/` to keep the runtime API core simple and secure.
