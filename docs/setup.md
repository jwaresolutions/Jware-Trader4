# Jware Trader V4 Setup Guide

## Prerequisites

Before setting up Jware Trader V4, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Python** (version 3.8 or higher)
- **Git**
- **A text editor** (VS Code recommended)

### Verify Prerequisites

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Python
python3 --version

# Check Git
git --version
```

## Quick Setup

The fastest way to get started is using our automated setup script:

```bash
# Clone the repository
git clone https://github.com/yourusername/Jware-Trader4.git
cd Jware-Trader4

# Run the setup script
./scripts/setup.sh
```

The setup script will:
1. Generate secure passwords for all services
2. Create necessary directories
3. Build all Docker images
4. Start all services
5. Initialize the database
6. Perform health checks

## Manual Setup

If you prefer to set up manually or need to troubleshoot:

### 1. Generate Environment Variables

```bash
# Generate secure passwords
python3 scripts/generate-passwords.py
```

This creates a `.env` file with all necessary passwords and configuration.

### 2. Build Docker Images

```bash
# Build all services
docker-compose build

# Or build in parallel for faster builds
docker-compose build --parallel
```

### 3. Start Services

```bash
# Start all services in detached mode
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### 4. Verify Services

Check that all services are running:

```bash
# Check container status
docker-compose ps

# Check service health
curl http://localhost:3000/health      # API Gateway
curl http://localhost:8000/health      # Trading Engine
curl http://localhost:8001/health      # Market Data
```

### 5. Initialize Database

The database is automatically initialized on first startup, but you can manually run migrations:

```bash
# Access the trading engine container
docker-compose exec trading-engine bash

# Run migrations (if using Alembic)
alembic upgrade head
```

## Service URLs

Once setup is complete, you can access:

- **Web UI**: http://localhost:3001
- **API Gateway**: http://localhost:3000
- **Trading Engine API Docs**: http://localhost:8000/docs
- **Market Data API Docs**: http://localhost:8001/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Default Credentials

- **Admin Username**: admin
- **Admin Password**: Check `.env` file for `ADMIN_PASSWORD`
- **Database User**: jware_trader
- **Database Password**: Check `.env` file for `POSTGRES_PASSWORD`

## Configuration

### Environment Variables

All configuration is managed through environment variables in the `.env` file:

```bash
# Database Configuration
POSTGRES_USER=jware_trader
POSTGRES_PASSWORD=<generated>
POSTGRES_DB=jware_trader_db

# Redis Configuration
REDIS_PASSWORD=<generated>

# Security
JWT_SECRET=<generated>
ADMIN_PASSWORD=<generated>

# Service URLs
TRADING_ENGINE_URL=http://trading-engine:8000
MARKET_DATA_URL=http://market-data:8001
API_GATEWAY_URL=http://api-gateway:3000
```

### Service Configuration

Each service has its own configuration:

- **Trading Engine**: `services/trading-engine/app/config.py`
- **Market Data**: `services/market-data/app/config.py`
- **API Gateway**: `services/api-gateway/src/config.ts`
- **Web UI**: `services/web-ui/next.config.js`

## Common Operations

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f trading-engine

# Last 100 lines
docker-compose logs --tail=100 trading-engine
```

### Stopping Services

```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything (including volumes)
docker-compose down -v
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart trading-engine
```

### Updating Services

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Troubleshooting

### Service Won't Start

1. Check logs: `docker-compose logs [service-name]`
2. Verify `.env` file exists and has all required variables
3. Check port conflicts: `netstat -tulpn | grep [port]`
4. Ensure Docker daemon is running

### Database Connection Issues

1. Verify PostgreSQL is running: `docker-compose ps postgres`
2. Check credentials in `.env` match service configuration
3. Test connection: `docker-compose exec postgres psql -U jware_trader`

### Redis Connection Issues

1. Verify Redis is running: `docker-compose ps redis`
2. Test connection: `docker-compose exec redis redis-cli ping`
3. Check password in `.env`

### Performance Issues

1. Check resource usage: `docker stats`
2. Increase Docker memory allocation
3. Check for memory leaks in logs
4. Review database query performance

## Development Setup

### Installing Dependencies Locally

For local development without Docker:

```bash
# Python services
cd services/trading-engine
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Node.js services
cd services/api-gateway
npm install
```

### Running Tests

```bash
# Python tests
docker-compose exec trading-engine pytest

# Node.js tests
docker-compose exec api-gateway npm test
```

### Code Formatting

```bash
# Python
docker-compose exec trading-engine black .
docker-compose exec trading-engine flake8

# TypeScript/JavaScript
docker-compose exec api-gateway npm run lint
docker-compose exec web-ui npm run lint
```

## Production Deployment

For production deployment:

1. Use production configuration files
2. Set up SSL/TLS certificates
3. Configure firewall rules
4. Set up monitoring and alerting
5. Configure backup strategies
6. Use container orchestration (Kubernetes)

See [deployment.md](deployment.md) for detailed production setup.

## Getting Help

- Check logs first: `docker-compose logs`
- Review documentation in `/docs`
- Check GitHub issues
- Join our Discord community

## Next Steps

1. Access the Web UI at http://localhost:3001
2. Create your first trading account
3. Configure a trading strategy
4. Start paper trading
5. Monitor performance

Happy Trading! 🚀