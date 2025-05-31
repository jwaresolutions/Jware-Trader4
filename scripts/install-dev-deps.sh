#!/bin/bash

echo "============================================"
echo "     Installing Local Development Dependencies"
echo "============================================"

# Install API Gateway dependencies
echo "[INFO] Installing API Gateway dependencies..."
cd services/api-gateway
npm install
npm install --save-dev @types/node @types/express @types/cors @types/ws
cd ../..

# Install Web UI dependencies
echo "[INFO] Installing Web UI dependencies..."
cd services/web-ui
npm install
cd ../..

echo "[SUCCESS] Development dependencies installed!"
echo ""
echo "Note: This is only for VSCode IntelliSense. Docker builds don't require this."