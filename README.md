# 🎓 Student Management System

**A full-stack school administration dashboard — students, teachers, attendance, library, exams, timetables, notices, transport and hostel — built with React 19, Express 5 and MySQL.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?logo=mysql&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-animation-88CE02?logo=greensock&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20active%20development-orange)

> ⚠️ **Work in progress.** The interface is complete across 13 modules. The student module is wired end-to-end to the database; the rest run on realistic seed data while their APIs are being built. See [Project status](#-project-status) for the honest breakdown.

---

## 📖 Table of contents

- [What this is](#-what-this-is)
- [Why I'm building it](#-why-im-building-it)
- [Who it's for](#-who-its-for)
- [Features](#-features)
- [Project status](#-project-status)
- [How it's built](#-how-its-built)
- [Getting started](#-getting-started)
- [Project structure](#-project-structure)
- [API overview](#-api-overview)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🧭 What this is

Most school offices still run on paper registers, a shared Excel file and a WhatsApp group. Enrolment lives in one place, attendance in another, fees in a third, and nobody can answer a simple question — *how many students in Grade 7 missed more than three days this month?* — without half an hour of cross-referencing.

This project is one dashboard for the whole school. An administrator signs in and can enrol a student, mark a register, issue a library book, build next term's timetable, enter exam marks, publish a notice to parents, assign a bus seat and allocate a hostel room — from the same interface, on a phone or a desktop.

It is built as a **real product**, not a tutorial exercise: server-side validation with field-level error reporting, image uploads with size and type limits, pagination, scored search, optimistic UI with toast feedback, and a design system that keeps 13 modules looking like one application.

---

## 💡 Why I'm building it

I'm a full-stack developer building toward freelance work, and I wanted a portfolio project that would force me through the problems tutorials skip:

- **Scale.** Anyone can build a CRUD to-do app. Thirteen interconnected modules is a different exercise — it forces real decisions about state architecture, folder structure and component reuse.
- **The unglamorous parts.** Duplicate-key errors mapped back to the exact input that caused them. Date columns that survive a timezone round trip. Avatar uploads that don't blow past a storage quota. Deleting twenty students without twenty round trips blocking the UI.
- **Something a real school could actually adopt.** It's designed with Cambodian schools in mind — a Khmer language option, Asia/Phnom Penh as the default timezone, and **Bakong KHQR** alongside Stripe for fee payments, so parents can pay with the banking app they already have.

The codebase is also written to be read. Comments explain *why* a decision was made, not what the line does — the reasoning behind a workaround is the part you can't recover later.

---

## 👥 Who it's for

| Audience | What they get |
|---|---|
| **Small and mid-size private schools** | One system instead of five spreadsheets — enrolment, attendance, exams, fees and communication in one place |
| **Language centers & academies** | Class rosters, timetables and attendance without enterprise-software pricing |
| **School administrators** | A dashboard that answers questions in seconds: who's absent, who's overdue, which class is over capacity |
| **Teachers** | Mark a register in one screen, enter exam marks with autosave, see their own weekly workload |
| **Developers** | A reference full-stack app — React 19 + Context architecture, Express 5 REST API, Sequelize models, file uploads, OTP email auth |

---

## ✨ Features

### Core modules

| Module | What it does |
|---|---|
| 🏠 **Dashboard** | Live stat cards, enrolment and attendance charts, recent activity feed, upcoming events |
| 👨‍🎓 **Students** | Full CRUD, scored live search by name or ID, bulk select and delete, paginated table (desktop) and cards (mobile), profile photo upload, detail view with attendance / results / fees / documents tabs |
| 👩‍🏫 **Teachers** | Directory with department filters, summary stats, add/edit forms with live validation, profile photos, detail view with weekly schedule |
| 📚 **Library** | Catalog with availability states, borrow / return / reserve flows, waiting queues, automatic overdue detection and fine calculation, per-member borrowing history |
| ✅ **Attendance** | Daily register marking, leave-request approvals, 30-day heatmap, absence-reason breakdown, at-risk student watch list |
| 📖 **Subjects** | Catalog with grading-weight editor (validated to 100%), prerequisite chains with **cycle detection**, syllabus versioning, bulk class assignment |
| 🏫 **Classes** | Sections with capacity rings, roster drawer with drag-and-drop transfers, class comparison, end-of-year promotion wizard |
| 📅 **Routine** | Drag-and-drop timetable builder with **live clash detection**, teacher workload balancing, absence cover assignment, bell-schedule editor, print view |
| 📝 **Exams** | Paper planner with conflict checks, mark entry with autosave, publish gating, grade analytics, seating plans, retake tracking |
| 🔔 **Notices** | Composer with layered audience targeting and live reach count, templates with placeholders, read tracking, archive |
| 🚌 **Transport** | Routes and stops, fleet records, seat occupancy, transport fees, maintenance and incident logs |
| 🏨 **Hostel** | Room allocation with eligibility checks, gate in/out log, leave approvals, warden rota coverage, maintenance tickets |
| ⚙️ **Account** | Profile, password change, 2FA setup, active sessions, notification preferences, language and timezone |

### Platform features

- 🔐 **OTP email verification** on signup and password reset (bcrypt hashing, time-limited codes)
- 🖼️ **Image uploads** — multer to local disk, 5MB cap, image-only filter, old files cleaned up on replace
- 💳 **Payments** — Stripe Checkout and Bakong KHQR QR generation (scaffolded)
- 📱 **Responsive throughout** — every table has a mobile card layout
- 🎬 **GSAP animation** on page load, tab changes, modals, row entrances and form validation errors
- 🎨 **Design-token CSS system** shared across all 13 modules
- 📋 **Server-side validation** that reports *which field* failed and *why*, so the form can highlight it

---

## 📊 Project status

| Module | UI | Logic | REST API | Database |
|---|:--:|:--:|:--:|:--:|
| Students | ✅ | ✅ | ✅ | ✅ |
| Teachers | ✅ | ✅ | 🟡 read + uploads | 🟡 partial |
| Auth (signup / OTP / reset) | ✅ | ✅ | 🟡 backend ready | ✅ |
| Library · Attendance · Subjects · Classes · Routine · Exams · Notices · Transport · Hostel · Account | ✅ | ✅ | ⬜ seed data | ⬜ |
| Payments | ⬜ | ⬜ | 🟡 scaffolded | — |

✅ done · 🟡 in progress · ⬜ not started

**What that means in practice:** every screen works and every interaction is real — the business logic for fines, clash detection, promotion rules and audience targeting is all written and running. What's missing for most modules is the database table and the REST layer underneath. Students is the reference implementation the others are being brought up to.

---

## 🏗️ How it's built

### Stack

**Frontend** — React 19 · Vite 8 · React Router 7 · Axios · GSAP · Tailwind 4 + custom CSS token system · Lucide icons · oxlint

**Backend** — Node.js · Express 5 · MySQL 8 · Sequelize 6 · mysql2 · bcrypt · jsonwebtoken · multer · nodemailer · Stripe · bakong-khqr

### Architecture decisions

**One context per domain.** Each module owns a React Context provider holding its state and every operation on it (`LibraryContext` has `borrowBook`, `returnBook`, `reserveBook`, fine calculation…). Components stay presentational, the logic is testable in one place, and swapping seed data for an API call touches exactly one file.

**Seed data first.** Every module was built against realistic seed data before any endpoint existed. That let the UI and business rules settle before committing to a schema — by the time a table gets designed, the shape the app actually needs is already proven.

**Feature-based folders.** `components/features/<module>/components/` keeps each module's panels, modals and tables together instead of scattering them across a global component dump.

**Errors that reach the right input.** A MySQL unique-constraint failure surfaces as "Validation error" with the offending column buried in the error object. The API unpacks it into `{ message, fields, reason }`, so the form can turn the right box red and say "This phone number is already registered" instead of a generic toast.

**Images resized and validated at both ends.** Uploads are capped at 5MB and image-only via multer, stored with generated filenames (never the user's), served from `/uploads`, and the replaced file is deleted on update.

---

## 🚀 Getting started

### Prerequisites

- **Node.js 18+** and npm
- **MySQL 8+** running locally
- A Gmail account with an **app password** (for OTP emails) — optional, only needed for signup and password reset

### 1. Clone

```bash
git clone https://github.com/seanmanutnithya/student_management_fullstack_application.git
cd student_management_fullstack_application
```

### 2. Create the databases

```sql
CREATE DATABASE student_management;
CREATE DATABASE auth_management;

USE student_management;

CREATE TABLE students (
  id            VARCHAR(20)  PRIMARY KEY,
  name          VARCHAR(30)  NOT NULL,
  gender        CHAR(1)      NOT NULL,
  std_class     VARCHAR(10)  NOT NULL,
  phone         VARCHAR(20)  NOT NULL UNIQUE,
  dob           DATE         NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  address       VARCHAR(100) NOT NULL,
  guardianName  VARCHAR(20)  NOT NULL,
  guardianPhone VARCHAR(20)  NOT NULL,
  remark        VARCHAR(300) NULL,
  avatar        VARCHAR(200) NOT NULL DEFAULT '',
  image_url     VARCHAR(200) NULL
);

CREATE TABLE teachers (
  id            VARCHAR(10)  PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(30)  NOT NULL UNIQUE,
  subject       VARCHAR(100) NOT NULL,
  dept          VARCHAR(100) NOT NULL,
  exp           VARCHAR(20)  NOT NULL,
  type          VARCHAR(50)  NOT NULL,
  qualification VARCHAR(150) NOT NULL,
  joinDate      DATETIME     NOT NULL,
  address       VARCHAR(200) NOT NULL,
  avatar        VARCHAR(255) NOT NULL DEFAULT ''
);

USE auth_management;

CREATE TABLE auths (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  email     VARCHAR(100) NOT NULL UNIQUE,
  password  VARCHAR(100) NOT NULL,
  phone     VARCHAR(20)  NOT NULL UNIQUE
);
```

### 3. Configure the environment

Create **`backend/.env`**:

```ini
# --- Student database ---
STUDENT_HOST=localhost
STUDENT_DB_HOST=localhost
STUDENT_DB_NAME=student_management
STUDENT_DB_USER=root
STUDENT_DB_PASSWORD=
STUDENT_DB_PORT=3306

# --- Auth database ---
AUTH_HOST=localhost
AUTH_DB_HOST=localhost
AUTH_DB_NAME=auth_management
AUTH_DB_USER=root
AUTH_DB_PASSWORD=
AUTH_DB_PORT=3306

# --- Teacher database (same server as students) ---
TEACHER_HOST=localhost
TEACHER_DB_HOST=localhost
TEACHER_DB_NAME=student_management
TEACHER_DB_USER=root
TEACHER_DB_PASSWORD=
TEACHER_DB_PORT=3306

# --- JWT ---
SECRET_TOKEN=change_me_to_a_long_random_string

# --- OTP email (Gmail app password) ---
MAIL_USER=you@gmail.com
APP_PASSWORD=your_16_char_app_password
ADMIN_GMAIL=admin@gmail.com

# --- Optional: Telegram notifications ---
TELEGRAM_BOT_TOKEN=
CHAT_ID=

# --- Optional: payments ---
STRIPE_SECRET_KEY=
BAKONG_ACCOUNT_ID=
MERCHANT_NAME=
MERCHANT_CITY=
MERCHANT_PHONE=
STORE_LABEL=
```

Create **`frontend_v2/.env`**:

```ini
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 4. Install dependencies and run

**Backend** — starts on `http://localhost:3000`

```bash
cd backend
npm install
npm start          # nodemon index.js
```

**Frontend** — starts on `http://localhost:5173` (open a second terminal)

```bash
cd frontend_v2
npm install
npm run dev
```

Other frontend scripts:

```bash
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # oxlint
```

> `frontend_v2` is the active app. `frontend_v1` is a frozen earlier revision kept for reference, and `frontend_traditional` is the original vanilla HTML/CSS/JS prototype the React version grew out of.

---

## 📁 Project structure

```
.
├── backend/
│   ├── index.js                # Express app, CORS, static /uploads, error handler
│   └── src/
│       ├── config/             # MySQL pools + Sequelize instances
│       ├── router/             # route registration per domain
│       ├── controller/         # student · teacher · auth · upload · payment
│       ├── models/             # Sequelize models: Students, Teachers, Auths
│       ├── middleware/         # JWT verification, multer upload config
│       ├── helper/             # validation, hashing, mail, avatar saving, logging
│       └── utils/              # OTP generation
│
├── frontend_v2/                # ← active app
│   └── src/
│       ├── pages/              # one folder per route (13 modules)
│       ├── components/
│       │   ├── features/       # per-module panels, tables, modals
│       │   ├── ui/             # shared kit: Button, Modal, Field, Toast, Pagination…
│       │   └── layout/         # Navbar, TopBar, MobileTopBar
│       ├── context/            # 14 providers — the state layer
│       ├── services/           # axios instance + API calls
│       ├── assets/data/        # seed data for modules awaiting their API
│       ├── animation/          # GSAP modules, one per page + shared effects
│       ├── hooks/ utils/ lib/  # pagination, date handling, image resize, regex
│       └── styles/             # design tokens + per-module CSS
│
├── frontend_v1/                # frozen earlier revision
└── frontend_traditional/       # original vanilla HTML/CSS/JS prototype
```

---

## 🔌 API overview

All routes are prefixed `/api/v1`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/student/get/all` | List all students |
| `GET` | `/student/get/:id` | Single student |
| `POST` | `/student/create` | Create — validates required and unique fields |
| `PUT` | `/student/update/:targetId` | Update (the ID itself can change) |
| `DELETE` | `/student/delete/:id` | Delete |
| `POST` | `/student/:id/avatar` | Upload profile photo (multipart) |
| `GET` | `/teacher/get/all` | List all teachers |
| `POST` | `/teacher/create` | Create |
| `PUT` | `/teacher/update/:targetId` | Update |
| `DELETE` | `/teacher/delete/:id` | Delete |
| `POST` | `/teacher/:id/avatar` | Upload profile photo (multipart) |
| `POST` | `/auth/signup` | Hash password, email an OTP |
| `POST` | `/auth/otp/verify` | Verify OTP and create the account |
| `POST` | `/auth/login` | Email + password login |
| `POST` | `/auth/send-otp` | Password-reset code |
| `POST` | `/auth/reset-password` | Set a new password |
| `POST` | `/cardpayway/stripe` | Create a Stripe Checkout session |
| `POST` | `/cardpayway/generate-khqr` | Generate a Bakong KHQR code |
| `POST` | `/cardpayway/verify` | Verify a KHQR payment |

---

## 🗺️ Roadmap

- [x] Design system, layout and navigation across all modules
- [x] Student module end-to-end (CRUD + search + bulk actions + photo upload)
- [x] Backend auth: signup, OTP email verification, password reset
- [x] Image uploads to disk with validation and cleanup
- [ ] Teacher module end-to-end (create / update / delete from the UI)
- [ ] Connect the frontend to the real auth API and issue JWTs on login
- [ ] Protect API routes with the JWT middleware
- [ ] Attendance: table, API, and real persistence
- [ ] Library: table, API, and real persistence
- [ ] Remaining modules, one at a time
- [ ] Role-based access (admin / teacher / student)
- [ ] Fee payments wired to Stripe and KHQR end-to-end
- [ ] Automated tests
- [ ] Deployment

---

## 👤 Author

**Sean Manut Nithya** — [@seanmanutnithya](https://github.com/seanmanutnithya)

Building toward full-stack freelance work. Feedback, issues and suggestions are welcome — open an issue or start a discussion.

---

## 📄 License

No license has been chosen yet. Until one is added, all rights are reserved; please open an issue if you'd like to use this code.
