# REMS - Real Estate Management System

<div align="center">

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Docker](https://img.shields.io/badge/Docker-20.10+-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

**A comprehensive property management system for modern real estate operations**

[Getting Started](#-getting-started) • [Features](#-features) • [Documentation](#-documentation) •
[API](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

REMS (Real Estate Management System) is a full-stack application designed to handle all aspects of
property management, from tenant contracts to maintenance orders, financial tracking, and
comprehensive reporting. Built with scalability and internationalization in mind, it supports
multiple properties, shared ownership, multi-currency transactions, and complete audit trails.

### 🎯 Key Capabilities

- **Multi-Property Portfolio Management** - Manage unlimited properties with shared ownership
  structures
- **Complete Tenant Lifecycle** - From application through contract expiration with payment tracking
- **Financial Management** - Invoicing, receipts, and multi-currency transaction tracking
- **Maintenance Workflow** - Request-to-completion tracking with vendor management
- **Multi-Portal Architecture** - Separate interfaces for owners, tenants, vendors, and
  administrators
- **Audit Compliance** - Complete tracking of all system changes for regulatory compliance

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (v4.0+) - [Download](https://www.docker.com/products/docker-desktop)
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/aalbahar80/rems.git
cd rems

# 2. Set up environment variables
cp .devcontainer/.env.example .devcontainer/.env
cp backend/.env.example backend/.env

# 3. Install dependencies and set up code quality tools
npm run setup

# 4. Start Docker containers
cd .devcontainer
docker-compose --profile tools up -d

# 5. Initialize the database (automatic on first run)
# Database will be populated with schema and seed data

# 6. Start the backend server
cd ../backend
npm run dev

# 7. Access the application
# API: http://localhost:3001
# pgAdmin: http://localhost:8080
# Database: localhost:5432
```

### Verify Installation

```bash
# Check Docker containers
docker-compose ps

# Test database connection
docker exec -it rems-postgres psql -U rems_user -d rems -c "SELECT COUNT(*) FROM rems.properties;"

# Test API health
curl http://localhost:3001/api/v1/health
```

---

## 🏗️ Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (Future)                    │
│                    React/Vue/Angular                      │
│                       Port: 3000                          │
└────────────────────────┬─────────────────────────────────┘
                         │ REST API
┌────────────────────────▼─────────────────────────────────┐
│                     Backend API                           │
│                  Node.js + Express                        │
│                      Port: 3001                           │
└────────────────────────┬─────────────────────────────────┘
                         │ SQL
┌────────────────────────▼─────────────────────────────────┐
│                  PostgreSQL Database                      │
│              23 Tables • 10 Modules • ACID                │
│                      Port: 5432                           │
└───────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer              | Technology              | Purpose                                   |
| ------------------ | ----------------------- | ----------------------------------------- |
| **Database**       | PostgreSQL 15           | Primary data store with advanced features |
| **Backend**        | Node.js 18 + Express    | RESTful API server                        |
| **Authentication** | JWT                     | Stateless authentication                  |
| **Container**      | Docker + Docker Compose | Development environment                   |
| **Code Quality**   | ESLint + Prettier       | Code formatting and linting               |
| **Testing**        | Jest + Supertest        | Unit and integration testing              |
| **Documentation**  | Markdown                | Comprehensive documentation               |

---

## ✨ Features

### 🏢 Property Management

- Multi-property portfolios with detailed metadata
- Shared ownership with percentage tracking
- Temporal ownership periods for historical tracking
- Unit-level management (apartments, studios, commercial spaces)
- Property valuation tracking with multiple methods

### 👥 Tenant Management

- Individual and corporate tenant profiles
- Dual-tenant contracts for couples/roommates
- Contract lifecycle management (upcoming → active → expired)
- Multiple identification document types
- International tenant support (10+ nationalities in seed data)

### 💰 Financial Management

- **Invoicing System**
  - Polymorphic invoices (rent, maintenance, utilities)
  - Recurring invoice automation
  - Multi-currency support (KWD, USD, EUR, etc.)
- **Payment Processing**
  - Multiple payment gateways (KNET, MyFatoorah, bank transfers)
  - Receipt generation with provider fees tracking
  - Late payment penalties

- **Transaction Tracking**
  - Rental transactions with payment status
  - Expense transactions with approval workflow
  - Comprehensive financial reporting

### 🔧 Maintenance & Vendors

- Maintenance request workflow (submitted → approved → completed)
- Vendor management with performance ratings
- Emergency service availability tracking
- Cost estimation vs. actual tracking
- Dual-requestor support (tenant or owner initiated)

### 👤 User & Security

- Role-based access control (Admin, Owner, Tenant, Vendor)
- JWT-based authentication
- Session management
- Password reset workflow
- Account lockout protection
- Two-factor authentication ready

### 📊 Reporting & Analytics

- Dashboard with key metrics
- Occupancy rate tracking
- Income and expense reports
- Maintenance history and trends
- Payment collection analysis
- Custom report generation

### 🔍 Audit & Compliance

- Complete audit trail for all changes
- Login history tracking
- System event logging
- Immutable financial records
- Data retention policies

---

## 📁 Project Structure

```
rems/
├── .devcontainer/          # Docker development environment
│   ├── docker-compose.yml  # Container orchestration
│   ├── Dockerfile          # Container image definition
│   └── .env.example        # Environment variables template
│
├── backend/                # Node.js API server
│   ├── src/               # Source code (to be implemented)
│   ├── tests/             # Test files (to be implemented)
│   ├── package.json       # Dependencies
│   └── .env.example       # Backend configuration template
│
├── database/              # Database layer
│   ├── schema/           # DDL scripts
│   │   └── REMS_DDL.sql  # Complete schema definition
│   ├── seeds/            # Seed data
│   │   └── seed.sql      # International test data
│   └── migrations/       # Database migrations (future)
│
├── docs/                  # Documentation
│   ├── database_docs/    # Database documentation
│   │   ├── 001_schema_documentation.md
│   │   └── 002_seed_data_documentation.md
│   ├── API_ENDPOINTS.md  # API documentation
│   ├── DOCKER_ENVIRONMENT.md
│   └── ENVIRONMENT_VARIABLES.md
│
├── frontend/             # Frontend application (future)
│
├── .gitignore           # Git ignore rules
├── .prettierrc          # Code formatting rules
├── .eslintrc.json       # Code quality rules
├── package.json         # Root package configuration
└── README.md           # This file
```

---

## 🗄️ Database Schema

The database consists of **23 tables** organized into **10 logical modules**:

| Module                       | Tables | Description                                    |
| ---------------------------- | ------ | ---------------------------------------------- |
| **Property & Ownership**     | 4      | Properties, units, and ownership periods       |
| **Tenant & Contracts**       | 2      | Tenants and rental agreements                  |
| **Financial Classification** | 2      | Expense categories and types                   |
| **Vendors & Maintenance**    | 2      | Service providers and work orders              |
| **Financial Transactions**   | 4      | Invoices, receipts, and transactions           |
| **Users & Authentication**   | 3      | Users, sessions, and password resets           |
| **System Configuration**     | 4      | Settings, currencies, templates, notifications |
| **Audit & Logging**          | 3      | Entity changes, login history, system logs     |

### Key Design Patterns

- **Polymorphic Relationships** - Flexible entity associations (invoices, users)
- **Temporal Data Management** - Time-based validity for ownership and contracts
- **Percentage-Based Relationships** - Fractional property ownership support
- **Audit Trail** - Comprehensive change tracking across all entities

---

## 🔌 API Reference

The RESTful API provides comprehensive endpoints for all system operations.

### Base URL

```
Development: http://localhost:3001/api/v1
Production:  https://api.your-domain.com/api/v1
```

### Authentication

All endpoints (except login) require JWT authentication:

```
Authorization: Bearer <jwt-token>
```

### Core Endpoints

| Module          | Endpoints                                      | Description                       |
| --------------- | ---------------------------------------------- | --------------------------------- |
| **Auth**        | `/auth/login`, `/auth/logout`, `/auth/profile` | Authentication & user management  |
| **Properties**  | `/properties`, `/properties/:id/units`         | Property CRUD operations          |
| **Tenants**     | `/tenants`, `/tenants/:id/contracts`           | Tenant management                 |
| **Contracts**   | `/contracts`, `/contracts/active`              | Rental agreement management       |
| **Invoices**    | `/invoices`, `/invoices/:id/send`              | Invoice generation and management |
| **Maintenance** | `/maintenance`, `/maintenance/:id/assign`      | Work order management             |
| **Reports**     | `/reports/occupancy`, `/reports/income`        | Analytics and reporting           |

📚 **[Full API Documentation](docs/development/api/api_endpoints.md)**

---

## 📖 Documentation

Comprehensive documentation is available for all aspects of the system:

| Document                                                                                               | Description                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 📘 **[Database Schema](docs/database/schema/schema_documentation.md)**                                 | Complete database structure and relationships          |
| 📗 **[Seed Data Guide](docs/database/seed_data/seed_data_documentation.md)**                           | Test data documentation with usage examples            |
| 📙 **[API Endpoints](docs/development/api/api_endpoints.md)**                                          | RESTful API documentation with examples                |
| 📕 **[Docker Environment](docs/development/docker/docker_environment.md)**                             | Container setup and management guide                   |
| 📓 **[Environment Variables](docs/development/setup/environment_variables.md)**                        | Configuration options and setup                        |
| 🎨 **[Admin Portal Wireframes](docs/development/wireframes/1_admin_portal/)**                          | Admin interface design specifications and journey maps |
| 💼 **[Accountant Portal Wireframes](docs/development/wireframes/2_accountant_portal/)**                | Financial management interface specifications          |
| 👤 **[Owner Portal Wireframes](docs/development/wireframes/3_owner_portal/)**                          | Property owner interface wireframes and specifications |
| 🏠 **[Tenant Portal Wireframes](docs/development/wireframes/4_tenant_portal/)**                        | Tenant interface design and user journey documentation |
| 📋 **[Project Status](docs/project_management/status/current_status.md)**                              | Current development status and progress tracking       |
| 🚀 **[Implementation Plan](docs/project_management/planning/rems_backend_api_implementation_plan.md)** | Backend API development roadmap and planning           |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test suite
npm test -- --testPathPattern=properties
```

### Test Coverage Goals

- Unit Tests: 80% coverage
- Integration Tests: Core workflows
- E2E Tests: Critical user journeys

---

## 🚦 Development Workflow

### Code Quality

The project uses automated code quality tools:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Git Workflow

1. **Branch Naming**
   - Feature: `feature/description`
   - Bug Fix: `fix/description`
   - Hotfix: `hotfix/description`

2. **Commit Messages** (Conventional Commits)

   ```
   feat: add property search functionality
   fix: resolve date validation in contracts
   docs: update API documentation
   refactor: optimize database queries
   test: add unit tests for tenant service
   ```

3. **Pull Request Process**
   - Create feature branch
   - Make changes with tests
   - Ensure all tests pass
   - Submit PR with description
   - Code review required
   - Merge after approval

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'feat: add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Fork and clone your fork
git clone https://github.com/aalbahar80/rems.git

# Add upstream remote
git remote add upstream https://github.com/aalbahar80/rems.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm test

# Push to your fork
git push origin feature/your-feature
```

---

## 📊 Project Status

### Current Phase: Foundation (v0.1.0)

- ✅ Database schema design and implementation
- ✅ Docker development environment
- ✅ Project structure and configuration
- ✅ Documentation
- 🚧 Backend API implementation
- 📅 Frontend development
- 📅 Testing suite
- 📅 CI/CD pipeline

### Roadmap

| Version    | Features                        | Timeline    |
| ---------- | ------------------------------- | ----------- |
| **v0.1.0** | Database, Docker, Documentation | ✅ Complete |
| **v0.2.0** | Core API endpoints              | In Progress |
| **v0.3.0** | Authentication & Authorization  | Q1 2024     |
| **v0.4.0** | Financial Management            | Q2 2024     |
| **v0.5.0** | Frontend Foundation             | Q2 2024     |
| **v1.0.0** | Production Ready                | Q3 2024     |

---

## 🔒 Security

### Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Email: security@aalbahar.com

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- Rate limiting on API endpoints
- SQL injection prevention
- XSS protection
- CORS configuration
- Environment variable isolation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead** - [aalbahar80](https://github.com/aalbahar80)
- **Contributors** - [Claude Code](https://claude.ai/code),
  [See all contributors](https://github.com/aalbahar80/rems/contributors)

---

## 🙏 Acknowledgments

- PostgreSQL team for the robust database engine
- Node.js community for the excellent ecosystem
- Docker for containerization technology
- Anthropic for Claude Code development assistance
- All open-source contributors

---

## 📞 Support

- 📧 **Email**: support@aalbahar.com
- 💬 **Discord**: [Join our server](#)
- 📖 **Wiki**: [GitHub Wiki](https://github.com/aalbahar80/rems/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/aalbahar80/rems/issues)

---

<div align="center">

**Built with ❤️ for the real estate management community**

[Back to Top](#rems---real-estate-management-system)

</div>
