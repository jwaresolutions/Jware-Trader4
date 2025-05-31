#!/bin/bash

echo "============================================"
echo "     Docker Network Debugging"
echo "============================================"

# Check if containers are running
echo -e "\n[INFO] Checking container status..."
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}"

# Check network configuration
echo -e "\n[INFO] Checking Docker networks..."
docker network ls

# Inspect the jware-network
echo -e "\n[INFO] Inspecting jware-network..."
docker network inspect jware-trader4_jware-network 2>/dev/null || docker network inspect jware-network 2>/dev/null

# Test connectivity from trading-engine to postgres
echo -e "\n[INFO] Testing connectivity from trading-engine to postgres..."
docker exec jware-trading-engine ping -c 3 postgres 2>/dev/null || echo "Ping failed or container not running"

# Check DNS resolution
echo -e "\n[INFO] Checking DNS resolution in trading-engine..."
docker exec jware-trading-engine nslookup postgres 2>/dev/null || echo "DNS lookup failed or container not running"

# Check environment variables in trading-engine
echo -e "\n[INFO] Checking environment variables in trading-engine..."
docker exec jware-trading-engine printenv | grep -E "(POSTGRES|REDIS)" 2>/dev/null || echo "Failed to get env vars"

# Check if postgres is actually accessible
echo -e "\n[INFO] Testing PostgreSQL connection..."
docker exec jware-trading-engine apt-get update -qq && docker exec jware-trading-engine apt-get install -qq -y postgresql-client 2>/dev/null
docker exec jware-trading-engine pg_isready -h postgres -p 5432 2>/dev/null || echo "PostgreSQL connection test failed"

echo -e "\n[INFO] Debug complete."