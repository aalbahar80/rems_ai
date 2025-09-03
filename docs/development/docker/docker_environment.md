# Docker Development Environment Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Container Services](#container-services)
6. [Development Workflow](#development-workflow)
7. [Database Management](#database-management)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)

---

## Overview

The REMS development environment provides a complete, containerized setup for building a
comprehensive property management application. This Docker-based environment ensures consistency
across all development machines and eliminates configuration issues.

### Key Benefits

- **Zero-Configuration Setup**: Start developing within minutes
- **Consistent Environment**: Identical setup across all team members
- **Isolated Dependencies**: No conflicts with local installations
- **Production-Similar**: Mirrors production deployment architecture
- **Complete Stack**: Database, backend, and tools pre-configured

### Target Users

- **Backend Developers**: Building REST APIs and business logic
- **Database Developers**: Working on schema design and optimization
- **Frontend Developers**: Need stable backend for integration
- **New Team Members**: Quick onboarding with minimal setup
- **DevOps Engineers**: Understanding the application stack

---

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   PostgreSQL    │
│   Port 3000     │◄──►│   Port 3001     │◄──►│   Port 5432     │
│   (Future)      │    │   Node.js API   │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                      ▲
                                │              ┌───────┴────────┐
                       ┌────────▼────────┐     │    pgAdmin     │
                       │  File Storage   │     │   Port 8080    │
                       │   ./uploads     │     │  Web Interface │
                       └─────────────────┘     └────────────────┘
```

### Container Stack

| Service  | Image                 | Port | Purpose                   |
| -------- | --------------------- | ---- | ------------------------- |
| postgres | postgres:15-alpine    | 5432 | Primary database          |
| pgadmin  | dpage/pgadmin4:latest | 8080 | Database administration   |
| backend  | node:18-alpine        | 3001 | API server (when running) |
| frontend | node:18-alpine        | 3000 | Web UI (future)           |

### Volume Mapping

```yaml
Volumes:
  postgres-data: Database persistence
  ./uploads: File upload storage
  ./backend: Backend source code
  ./frontend: Frontend source code
```

---

## Prerequisites

### Required Software

- **Docker Desktop** (v4.0+)
  - Windows: [Download](https://www.docker.com/products/docker-desktop)
  - macOS: [Download](https://www.docker.com/products/docker-desktop)
  - Linux: [Installation Guide](https://docs.docker.com/engine/install/)
- **Docker Compose** (v2.0+) - Included with Docker Desktop
- **Git** for version control
- **Code Editor** (VS Code recommended)

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: 10GB free space
- **CPU**: 2+ cores recommended
- **OS**: Windows 10+, macOS 10.15+, or Linux

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/aalbahar80/rems.git
cd rems
```

### 2. Environment Configuration

```bash
# Copy environment templates
cp .devcontainer/.env.example .devcontainer/.env
cp backend/.env.example backend/.env

# Edit configuration files
nano .devcontainer/.env  # or use your preferred editor
```

### 3. Configure Database Credentials

**.devcontainer/.env:**

```env
POSTGRES_DB=rems
POSTGRES_USER=rems_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432
```

**backend/.env:**

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=rems
DB_USER=rems_user
DB_PASSWORD=your_secure_password_here  # Must match above
```

### 4. Start Docker Environment

```bash
# Navigate to devcontainer directory
cd .devcontainer

# Start all services
docker-compose up -d

# Or with pgAdmin included
docker-compose --profile tools up -d
```

### 5. Initialize Database Schema

After containers are running, initialize the database schema:

```bash
# Navigate back to project root (if in .devcontainer)
cd ..

# Initialize base schema (REQUIRED - run first)
docker exec -i postgres psql -U rems_user rems < database/schema/00_rems_base_schema.sql

# Initialize additional features (run in order)
docker exec -i postgres psql -U rems_user rems < database/schema/01_firms_multi_tenant_support.sql
docker exec -i postgres psql -U rems_user rems < database/schema/02_ownership_model_enhancements.sql
docker exec -i postgres psql -U rems_user rems < database/schema/03_approval_workflow_improvements.sql
docker exec -i postgres psql -U rems_user rems < database/schema/04_tenant_portal_features.sql
docker exec -i postgres psql -U rems_user rems < database/schema/05_business_intelligence_views.sql
docker exec -i postgres psql -U rems_user rems < database/schema/06_advanced_business_functions.sql
```

### 6. Verify Installation

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Test database connection
docker exec -it postgres psql -U rems_user -d rems -c "SELECT version();"

# Verify schema initialization
docker exec -it postgres psql -U rems_user -d rems -c "\dt rems.*"
```

---

## Container Services

### PostgreSQL Database

**Connection Details:**

- Host: `localhost` (external) / `postgres` (internal)
- Port: `5432`
- Database: `rems`
- Schema: `rems`
- User: `rems_user`
- Password: (from .env file)

**Features:**

- PostgreSQL 15 with latest features
- Automatic schema initialization
- Seed data for development
- Persistent volume storage

### pgAdmin Web Interface

**Access:** http://localhost:8080

**Login Credentials:**

- Email: `admin@rems.local` (from .env)
- Password: (from .env file)

**Adding Database Connection:**

1. Right-click "Servers" → Create → Server
2. General Tab: Name = "REMS Development"
3. Connection Tab:
   - Host: `postgres`
   - Port: `5432`
   - Database: `rems`
   - Username: `rems_user`
   - Password: (from .env)

### Backend API Server

**Access:** http://localhost:3001

**Starting the Server:**

```bash
cd backend
npm install  # First time only
npm run dev  # Development mode with hot reload
```

---

## Development Workflow

### Daily Workflow

#### Starting Your Day

```bash
# 1. Start Docker containers
cd .devcontainer
docker-compose up -d

# 2. Check container status
docker-compose ps

# 3. Start backend development
cd ../backend
npm run dev

# 4. Open pgAdmin (optional)
open http://localhost:8080
```

#### During Development

```bash
# View logs
docker-compose logs -f [service-name]

# Access database shell
docker exec -it postgres psql -U rems_user -d rems

# Restart a service
docker-compose restart [service-name]

# Stop all services
docker-compose stop
```

#### End of Day

```bash
# Stop containers (preserves data)
docker-compose stop

# Or remove containers (data persists in volumes)
docker-compose down
```

### Database Operations

#### Reset Database

```bash
# Complete reset with fresh schema
cd .devcontainer
docker-compose down
docker volume rm .devcontainer_postgres-data
docker-compose up -d

# After containers are running, initialize schema (from project root)
cd ..
docker exec -i postgres psql -U rems_user rems < database/schema/00_rems_base_schema.sql
# Then run additional schema files as needed (01-06)
```

#### Backup Database

```bash
# Create backup
docker exec postgres pg_dump -U rems_user rems > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i postgres psql -U rems_user rems < backup_20240101.sql
```

#### Initialize Database Schema

After container startup, initialize the database schema in order:

```bash
# Execute base schema (required first)
docker exec -i postgres psql -U rems_user rems < database/schema/00_rems_base_schema.sql

# Execute enhancements in order
docker exec -i postgres psql -U rems_user rems < database/schema/01_firms_multi_tenant_support.sql
docker exec -i postgres psql -U rems_user rems < database/schema/02_ownership_model_enhancements.sql
docker exec -i postgres psql -U rems_user rems < database/schema/03_approval_workflow_improvements.sql
docker exec -i postgres psql -U rems_user rems < database/schema/04_tenant_portal_features.sql
docker exec -i postgres psql -U rems_user rems < database/schema/05_business_intelligence_views.sql
docker exec -i postgres psql -U rems_user rems < database/schema/06_advanced_business_functions.sql
```

#### Run Individual Schema Files

```bash
# Execute specific schema file
docker exec -i postgres psql -U rems_user rems < database/schema/[filename].sql
```

---

## Database Management

### Schema Overview

**Database Schema Files Structure:**

The database schema is organized in `/database/schema/` with intuitive naming:

| File                                    | Purpose                     | Status         |
| --------------------------------------- | --------------------------- | -------------- |
| `00_rems_base_schema.sql`               | Core database schema        | Required first |
| `01_firms_multi_tenant_support.sql`     | Multi-tenant firm support   | Enhancement    |
| `02_ownership_model_enhancements.sql`   | Advanced ownership tracking | Enhancement    |
| `03_approval_workflow_improvements.sql` | Approval workflow system    | Enhancement    |
| `04_tenant_portal_features.sql`         | Tenant self-service portal  | Enhancement    |
| `05_business_intelligence_views.sql`    | Reporting and analytics     | Enhancement    |
| `06_advanced_business_functions.sql`    | Extended business logic     | Enhancement    |

**Database Contents:**

The REMS database contains 23 tables across 10 modules:

| Module               | Tables | Purpose                          |
| -------------------- | ------ | -------------------------------- |
| Property & Ownership | 4      | Core property management         |
| Tenant & Contracts   | 2      | Lease management                 |
| Financial            | 5      | Invoices, receipts, transactions |
| Maintenance          | 2      | Work orders and vendors          |
| Users & Auth         | 3      | Authentication and permissions   |
| System Config        | 4      | Settings and notifications       |
| Audit                | 3      | Logging and history              |

### Useful Database Commands

```sql
-- Check schema structure
\dt rems.*

-- View table details
\d rems.properties

-- List all views
\dv rems.*

-- Check database size
SELECT pg_database_size('rems');

-- Active connections
SELECT * FROM pg_stat_activity WHERE datname = 'rems';
```

### Sample Queries

```sql
-- Property overview
SELECT p.property_code,
       p.property_name,
       COUNT(u.unit_id) as units,
       COUNT(DISTINCT rc.contract_id) as active_contracts
FROM rems.properties p
LEFT JOIN rems.units u ON p.property_id = u.property_id
LEFT JOIN rems.rental_contracts rc ON u.unit_id = rc.unit_id
  AND rc.contract_status = 'active'
GROUP BY p.property_id;

-- Current month income
SELECT SUM(rt.collected_amount) as total_collected
FROM rems.rental_transactions rt
WHERE rt.year = EXTRACT(YEAR FROM CURRENT_DATE)
  AND rt.month = EXTRACT(MONTH FROM CURRENT_DATE);
```

---

## Troubleshooting

### Common Issues & Solutions

#### Port Already in Use

**Error:** "bind: address already in use"

**Solution:**

```bash
# Find process using port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Change port in .env or stop conflicting service
```

#### Database Connection Failed

**Error:** "could not connect to database"

**Solutions:**

1. Check container is running: `docker-compose ps`
2. Verify credentials match in both .env files
3. Check logs: `docker-compose logs postgres`
4. Restart container: `docker-compose restart postgres`

#### Permission Denied

**Error:** "permission denied for schema rems"

**Solution:**

```bash
# Reset database permissions
docker exec -it postgres psql -U postgres -c "GRANT ALL ON SCHEMA rems TO rems_user;"
```

#### Container Won't Start

**Error:** "container exited with code 1"

**Solutions:**

1. Check logs: `docker-compose logs [service]`
2. Clear volumes: `docker-compose down -v`
3. Rebuild: `docker-compose build --no-cache`
4. Check disk space: `docker system df`

### Debug Commands

```bash
# Container inspection
docker inspect postgres

# Check resource usage
docker stats

# Clean up unused resources
docker system prune -a

# View detailed logs
docker-compose logs --tail=100 -f postgres

# Execute commands in container
docker exec -it postgres bash
```

---

## Performance Optimization

### Docker Settings

**Docker Desktop Settings:**

- Memory: Allocate at least 4GB
- CPUs: 2+ cores
- Disk: Enable virtualization

### Database Optimization

```sql
-- Update statistics
ANALYZE;

-- Vacuum tables
VACUUM ANALYZE rems.rental_transactions;

-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC LIMIT 10;
```

### Development Tips

1. **Use .dockerignore** to exclude unnecessary files
2. **Enable BuildKit** for faster builds: `export DOCKER_BUILDKIT=1`
3. **Limit logging** in development: `driver: "none"` in docker-compose
4. **Use volumes** for source code instead of rebuilding
5. **Regular cleanup**: `docker system prune` weekly

---

## Appendix

### Useful Aliases

Add to your shell profile (.bashrc, .zshrc):

```bash
# Docker shortcuts
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dce='docker-compose exec'

# REMS specific
alias rems-db='docker exec -it postgres psql -U rems_user -d rems'
alias rems-logs='docker-compose -f .devcontainer/docker-compose.yml logs -f'
alias rems-reset='cd .devcontainer && docker-compose down && docker volume rm .devcontainer_postgres-data && docker-compose up -d && cd ..'
```

### VS Code DevContainer

For integrated development, use VS Code's DevContainer feature:

1. Install "Remote - Containers" extension
2. Open project folder
3. Click "Reopen in Container" when prompted
4. VS Code runs inside the container with full access

### Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/15/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

---

_Last Updated: [23/08/2025]_  
_Version: 1.0_
