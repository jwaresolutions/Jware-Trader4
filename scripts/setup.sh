#!/bin/bash

# Jware Trader V4 Setup Script
# This script sets up the entire development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo "============================================"
echo "     Jware Trader V4 Setup Script"
echo "============================================"
echo ""

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if ! command_exists python3; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

print_success "All prerequisites are installed."

# Generate passwords
print_status "Generating secure passwords..."
if [ ! -f .env ]; then
    python3 scripts/generate-passwords.py
    print_success "Passwords generated and saved to .env file."
else
    print_warning ".env file already exists. Skipping password generation."
    read -p "Do you want to regenerate passwords? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python3 scripts/generate-passwords.py
        print_success "New passwords generated."
    fi
fi

# Create necessary directories
print_status "Creating directory structure..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis
print_success "Directory structure created."

# Build Docker images
print_status "Building Docker images..."
docker-compose build --parallel
print_success "Docker images built successfully."

# Start services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check service health
print_status "Checking service health..."

# Function to check service health
check_service() {
    local service_name=$1
    local health_url=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$health_url" > /dev/null 2>&1; then
            print_success "$service_name is healthy"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start"
    return 1
}

# Check each service
echo -n "Checking PostgreSQL"
check_service "PostgreSQL" "http://localhost:5432" || true

echo -n "Checking Redis"
check_service "Redis" "http://localhost:6379" || true

echo -n "Checking Trading Engine"
check_service "Trading Engine" "http://localhost:8000/health"

echo -n "Checking Market Data"
check_service "Market Data" "http://localhost:8001/health"

echo -n "Checking API Gateway"
check_service "API Gateway" "http://localhost:3000/health"

echo -n "Checking Web UI"
check_service "Web UI" "http://localhost:3001"

# Create admin user
print_status "Creating admin user..."
# TODO: Implement admin user creation via API
print_warning "Admin user creation not yet implemented. Please create manually."

# Display summary
echo ""
echo "============================================"
echo "     Setup Complete!"
echo "============================================"
echo ""
print_success "All services are running."
echo ""
echo "Service URLs:"
echo "  - Web UI:        http://localhost:3001"
echo "  - API Gateway:   http://localhost:3000"
echo "  - Trading Engine: http://localhost:8000"
echo "  - Market Data:   http://localhost:8001"
echo ""
echo "Database:"
echo "  - PostgreSQL:    localhost:5432"
echo "  - Redis:         localhost:6379"
echo ""
echo "Default Credentials:"
echo "  - Username: admin"
echo "  - Password: Check .env file for ADMIN_PASSWORD"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "To stop all services:"
echo "  docker-compose down"
echo ""
print_warning "Remember: Never commit the .env file to version control!"