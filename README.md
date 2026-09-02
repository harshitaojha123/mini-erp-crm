Mini ERP + CRM Operations Portal

A full-stack Mini ERP + CRM Operations Portal for managing customers, products, inventory, stock movements, and sales challans.

Live Demo

Frontend: Deployed on Vercel

Backend API: https://mini-erp-crm-1-adw.onrender.com

GitHub: https://github.com/harshitaojha123/mini-erp-crm

Features

Authentication & Roles

JWT-based authentication with four roles:

Admin

Sales

Warehouse

Accounts

CRM

Add, edit, search and view customers

Retail / Wholesale / Distributor customer types

Lead / Active / Inactive status

Follow-up date and notes

Follow-up history

Products & Inventory

Add and edit products

SKU, category, unit price

Current stock and minimum stock alert

Warehouse information

Low-stock identification

Stock Movement

Stock IN / OUT

Quantity and reason

Created-by and timestamp tracking

Automatic stock updates

Prevents negative inventory

Sales Challans

Select customer

Multiple products and quantities

Automatic challan number

Draft / Confirmed / Cancelled status

Product snapshot stored on challan items

Confirmed challans reduce stock

Insufficient stock validation

Draft cancellation

Dashboard

KPI cards

Recent challans

Low-stock alerts

Quick actions

Role-aware navigation

Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router, Lucide React

Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, Zod

Deployment: Vercel (frontend), Render (backend), PostgreSQL / Neon (database)

Project Structure

mini-erp-crm/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   └── seed.ts
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    ├── package.json
    └── vite.config.ts

API Endpoints

Authentication

Method

Endpoint

Description

POST

/api/auth/register

Register user

POST

/api/auth/login

Login

GET

/api/auth/me

Current user

Customers

Method

Endpoint

Description

GET

/api/customers

List/search customers

GET

/api/customers/:id

Customer details

POST

/api/customers

Create customer

PUT

/api/customers/:id

Update customer

POST

/api/customers/:id/follow-ups

Add follow-up

Products

Method

Endpoint

Description

GET

/api/products

List products

POST

/api/products

Create product

PUT

/api/products/:id

Update product

Stock

Method

Endpoint

Description

GET

/api/stock/movements

List stock movements

POST

/api/stock/movements

Create stock movement

Challans

Method

Endpoint

Description

GET

/api/challans

List challans

POST

/api/challans

Create draft challan

PATCH

/api/challans/:id/confirm

Confirm challan

PATCH

/api/challans/:id/cancel

Cancel draft challan

Dashboard

Method

Endpoint

Description

GET

/api/dashboard

Dashboard statistics

Role Permissions

Module

Admin

Sales

Warehouse

Accounts

Dashboard

✓

✓

✓

✓

Customers

✓

✓

—

—

Products

✓

—

✓

—

Stock Movement

✓

—

✓

—

Challans

✓

✓

—

✓

Demo Credentials

All demo users use:

Password: Password@123

Role

Email

Admin

admin@erp.com

Sales

sales@erp.com

Warehouse

warehouse@erp.com

Accounts

accounts@erp.com

Local Setup

1. Clone

git clone https://github.com/harshitaojha123/mini-erp-crm.git
cd mini-erp-crm

2. Backend

cd backend
npm install

Create backend/.env:

DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5000

Then:

npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev

Backend:

http://localhost:5000

3. Frontend

Open another terminal:

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://localhost:5000/api

Then:

npm run dev

Frontend normally runs at:

http://localhost:5173

Architecture

React + TypeScript
        │
      Axios
        │
        ▼
Express REST API
        │
   JWT + Zod
        │
        ▼
     Prisma
        │
        ▼
   PostgreSQL

Important Business Rules

Stock OUT cannot make inventory negative.

Stock movements update current product stock.

Challans are created as DRAFT.

Only draft challans can be confirmed.

Confirming a challan checks stock and reduces inventory atomically.

Insufficient stock returns an API error.

Challan items store product name, SKU and unit-price snapshots.

Draft challans can be cancelled.

Confirmed/cancelled challans cannot be confirmed again.

Role-based authorization restricts protected operations.

Environment Variables

Backend

DATABASE_URL=
JWT_SECRET=
PORT=

Frontend

VITE_API_URL=

Never commit real database credentials or JWT secrets to GitHub.

Deployment

Backend — Render

Production API:

https://mini-erp-crm-1-adw.onrender.com

Frontend — Vercel

Configuration:

Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist

Production API variable:

VITE_API_URL=https://mini-erp-crm-1-adw.onrender.com/api

Testing

Use Postman or another REST client.

After login, send:

Authorization: Bearer <JWT_TOKEN>

Recommended flow:

Login with a demo account.

Copy the JWT token.

Test endpoints permitted for that role.

Create products and stock movements.

Create a draft challan.

Confirm the challan and verify inventory reduction.

Test insufficient-stock and authorization errors.

Future Improvements

PDF challan generation

Cloud document storage

Advanced filtering and reporting

Warehouse-level inventory

Audit logs

Automated tests

Docker

GitHub Actions CI/CD

Refresh-token authentication

Limitations

This is a focused case-study implementation rather than a complete production ERP. Advanced enterprise features such as granular permissions, extensive audit logging, advanced reporting, automated testing, and document storage can be added in future iterations.

Author

Harshita Ojha

Built as a Full Stack Developer case-study project demonstrating REST APIs, React, PostgreSQL, Prisma, JWT authentication, role-based authorization, CRM workflows, inventory management, sales challans, and cloud deployment.
