# 🚀 Mini ERP + CRM Operations Portal

<div align="center">

### A modern full-stack ERP & CRM platform for business operations

Manage **customers, products, inventory, stock movements, and sales challans** from one centralized platform.

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br/>

**[🌐 Live Application](https://mini-erp-crm.vercel.app/)** •
**[⚙️ Backend API](https://mini-erp-crm-1-adw.onrender.com)** •
**[💻 GitHub Repository](https://github.com/harshitaojha123/mini-erp-crm)**

</div>

---

## 📌 Overview

**Mini ERP + CRM Operations Portal** is a full-stack business operations application designed to demonstrate real-world ERP/CRM workflows.

The application provides separate role-based access for:

- 👨‍💼 Admin
- 💼 Sales
- 📦 Warehouse
- 💰 Accounts

It combines **CRM, inventory management, stock tracking, and sales challan management** into a single responsive application.

---

# ✨ Key Features

## 🔐 Authentication & Role-Based Access

Secure JWT-based authentication with role-specific permissions.

| Role | Access |
|---|---|
| 👨‍💼 **Admin** | Full system access |
| 💼 **Sales** | Customers + Challans |
| 📦 **Warehouse** | Products + Stock |
| 💰 **Accounts** | Dashboard + Challans |

Protected APIs use:

```http
Authorization: Bearer <JWT_TOKEN>
