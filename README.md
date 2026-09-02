# 🚀 Mini ERP + CRM Operations Portal

<div align="center">

<img src="https://img.shields.io/badge/Project-Mini%20ERP%20%2B%20CRM-2563EB?style=for-the-badge" />

<br />
<br />

**A full-stack ERP & CRM operations management platform**

Manage customers, products, inventory, stock movements and sales challans through one centralized business portal.

<br />

[🌐 Live Application](https://mini-erp-crm-wine.vercel.app/) •
[⚙️ Backend API](https://mini-erp-crm-7ey1.onrender.com) •
[💻 GitHub Repository](https://github.com/harshitaojha123/mini-erp-crm)

<br />
<br />

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

## 📌 Project Overview

**Mini ERP + CRM Operations Portal** is a full-stack business operations application developed to demonstrate a practical ERP/CRM workflow.

The system is designed around the day-to-day requirements of a wholesale/distribution business where different teams such as **Sales, Warehouse and Accounts** need access to different parts of the system.

The application brings together:

- 👥 Customer CRM
- 📦 Product management
- 📊 Inventory tracking
- 🔄 Stock movement management
- 🧾 Sales challan management
- 👤 Role-based access control
- 📈 Operations dashboard

The primary goal of this project is to demonstrate understanding of:

- Full-stack application architecture
- REST API development
- Database design
- Authentication
- Authorization
- Validation
- Inventory business logic
- Transaction handling
- Responsive frontend development
- Cloud deployment

---

# 🎯 Problem Statement

A wholesale/distribution company needs a centralized system to manage its operational workflow.

Different teams need different access:

```text
Sales
 ├── Manage Customers
 ├── Add Follow-ups
 └── Create Sales Challans

Warehouse
 ├── Manage Products
 ├── Manage Stock
 └── Track Stock Movements

Accounts
 ├── View Dashboard
 └── View Sales Challans

Admin
 └── Full System Access
                             ┌─────────────────────┐
                         │      Vercel         │
                         │   React Frontend    │
                         └──────────┬──────────┘
                                    │
                                  Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Render         │
                         │   Express REST API  │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
            JWT Auth           Zod Validation      Business Logic
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Prisma        │
                         │        ORM          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │    Neon Database    │
                         └─────────────────────┘
Project Structure
mini-erp-crm/
│
├── backend/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── customerController.ts
│   │   │   ├── productController.ts
│   │   │   ├── stockController.ts
│   │   │   ├── challanController.ts
│   │   │   └── dashboardController.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   └── roleMiddleware.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── customerRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── stockRoutes.ts
│   │   │   ├── challanRoutes.ts
│   │   │   └── dashboardRoutes.ts
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   │
│   │   ├── app.ts
│   │   ├── server.ts
│   │   └── seed.ts
│   │
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── StockMovement.tsx
│   │   │   └── Challans.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
