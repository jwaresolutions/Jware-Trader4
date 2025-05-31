#!/bin/bash

echo "============================================"
echo "     Restarting Jware Trader Services"
echo "============================================"

# Stop all containers
echo "[INFO] Stopping containers..."
docker-compose down

# Rebuild and start services
echo "[INFO] Rebuilding and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "[INFO] Waiting for services to initialize..."
sleep 10

# Check service status
echo -e "\n[INFO] Service Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check logs for any errors
echo -e "\n[INFO] Checking for startup errors..."
echo -e "\n--- Trading Engine ---"
docker logs jware-trading-engine 2>&1 | tail -20

echo -e "\n--- Market Data ---"
docker logs jware-market-data 2>&1 | tail -20

echo -e "\n--- API Gateway ---"
docker logs jware-api-gateway 2>&1 | tail -10

echo -e "\n--- Web UI ---"
docker logs jware-web-ui 2>&1 | tail -10

echo -e "\n[INFO] Restart complete!"