# API Keys Setup Guide

## Overview

Jware-Trader4 supports multiple trading platforms and market data providers. You'll need to add your API keys to the `.env` file before starting the application.

## Required API Keys

### 1. Alpaca Trading (Recommended for US Stocks)
- **Sign up**: https://alpaca.markets/
- **Free tier**: Paper trading available
- **Keys needed**:
  - `ALPACA_API_KEY`: Your API key ID
  - `ALPACA_SECRET_KEY`: Your secret key
  - `ALPACA_BASE_URL`: 
    - Paper trading: `https://paper-api.alpaca.markets`
    - Live trading: `https://api.alpaca.markets`

### 2. Polygon.io (Market Data)
- **Sign up**: https://polygon.io/
- **Free tier**: Limited to 5 API calls/minute
- **Keys needed**:
  - `POLYGON_API_KEY`: Your API key

## Optional API Keys

### Interactive Brokers
- **Requirements**: IB Gateway or TWS running
- **Configuration**:
  - `IB_GATEWAY_HOST`: Usually `localhost`
  - `IB_GATEWAY_PORT`: Default `7497` (paper) or `7496` (live)
  - `IB_CLIENT_ID`: Your client ID (default: 1)

### Binance (Cryptocurrency)
- **Sign up**: https://www.binance.com/
- **Keys needed**:
  - `BINANCE_API_KEY`: Your API key
  - `BINANCE_SECRET_KEY`: Your secret key

### Additional Data Providers
- **Finnhub**: `FINNHUB_API_KEY` - https://finnhub.io/
- **Alpha Vantage**: `ALPHA_VANTAGE_API_KEY` - https://www.alphavantage.co/

## Setup Instructions

1. **Edit the .env file**:
   ```bash
   nano .env
   # or
   vim .env
   ```

2. **Replace placeholder values** with your actual API keys:
   ```env
   # Example for Alpaca
   ALPACA_API_KEY=PKY7QN8VB5K2M3XYZ123
   ALPACA_SECRET_KEY=pYkL3M9nB5vX2qW8eR4tY7uI1oP0
   ALPACA_BASE_URL=https://paper-api.alpaca.markets
   ```

3. **Save the file** and ensure it's not committed to git:
   ```bash
   # .env is already in .gitignore, but double-check:
   git status
   ```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use paper trading** keys for development
3. **Restrict API key permissions** when possible:
   - Alpaca: Use read-only keys for market data
   - Binance: Restrict to trading pairs you need
4. **Rotate keys regularly**
5. **Use environment-specific keys** (dev/staging/prod)

## Testing Your Keys

After adding your keys and starting the application:

1. **Check service health**:
   ```bash
   curl http://localhost:8000/health
   curl http://localhost:8001/health
   ```

2. **Test market data** (once implemented):
   ```bash
   curl http://localhost:3000/api/v1/quotes/AAPL
   ```

3. **Check logs** for any authentication errors:
   ```bash
   docker logs jware-trading-engine
   docker logs jware-market-data
   ```

## Troubleshooting

### "Invalid API Key" Errors
- Ensure keys are copied correctly (no extra spaces)
- Check if keys are activated on the provider's dashboard
- Verify you're using the correct base URL (paper vs live)

### "Rate Limit Exceeded"
- Upgrade your plan or implement caching
- Use WebSocket connections for real-time data
- Implement exponential backoff for retries

### Connection Issues
- Check if provider requires IP whitelisting
- Ensure your firewall allows outbound HTTPS
- Verify the provider's API status page

## Next Steps

Once your API keys are configured:

1. Run `./scripts/restart-services.sh` to apply changes
2. Access the Web UI at http://localhost:3001
3. Start with paper trading to test your strategies
4. Monitor logs for any issues