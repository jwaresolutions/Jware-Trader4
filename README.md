# Jware Trader V4

A professional automated trading platform built with a microservices architecture, featuring real-time market data, advanced trading strategies, and comprehensive risk management.

## 🚀 Features

- **Microservices Architecture**: Scalable and maintainable design with clear separation of concerns
- **Real-time Market Data**: WebSocket-based streaming for live price updates
- **Automated Trading**: Support for multiple trading strategies and algorithms
- **Risk Management**: Built-in position sizing, stop-loss, and portfolio management
- **Paper Trading**: Test strategies without real money
- **RESTful API**: Comprehensive API for all trading operations
- **Modern Web UI**: React-based dashboard with real-time updates
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Comprehensive Logging**: Structured logging with correlation IDs for debugging
- **Docker-based Development**: Easy setup with Docker Compose

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│     Web UI      │────▶│   API Gateway   │────▶│ Trading Engine  │
│   (Next.js)     │     │   (Express)     │     │   (FastAPI)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                         │
                                │                         │
                                ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │  Market Data    │     │   PostgreSQL    │
                        │   (FastAPI)     │     │   + TimescaleDB │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
                                │                         │
                                └─────────┬───────────────┘
                                          │
                                          ▼
                                  ┌─────────────────┐
                                  │                 │
                                  │      Redis      │
                                  │   (Pub/Sub)     │
                                  │                 │
                                  └─────────────────┘
```

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js 20+
- Git

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Jware-Trader4.git
   cd Jware-Trader4
   ```

2. **Run the setup script**
   ```bash
   ./scripts/setup.sh
   ```

   This script will:
   - Generate secure passwords for all services
   - Create necessary directories
   - Build Docker images
   - Start all services
   - Initialize the database
   - Check service health

3. **Access the application**
   - Web UI: http://localhost:3001
   - API Gateway: http://localhost:3000
   - API Documentation: http://localhost:8000/docs
   
   **Note for Remote Development**: If you're developing on a remote host, replace `localhost` with your remote host's IP address or domain name. You may also need to configure your firewall to allow access to these ports.

## 🔧 Manual Setup

If you prefer to set up manually:

1. **Generate passwords**
   ```bash
   python3 scripts/generate-passwords.py
   ```

2. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

3. **Check service health**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:8000/health
   curl http://localhost:8001/health
   ```

## 📁 Project Structure

```
Jware-Trader4/
├── config/                 # Configuration files
│   ├── development.json
│   └── production.json
├── services/              # Microservices
│   ├── trading-engine/    # Core trading logic (Python/FastAPI)
│   ├── market-data/       # Market data service (Python/FastAPI)
│   ├── api-gateway/       # API Gateway (Node.js/Express)
│   └── web-ui/           # Web interface (Next.js)
├── shared/               # Shared code and types
├── scripts/              # Setup and utility scripts
├── docs/                 # Documentation
├── docker-compose.yml    # Docker Compose configuration
└── .env                  # Environment variables (generated)
```

## 🔐 Security

- All passwords are automatically generated using cryptographically secure methods
- JWT tokens for authentication
- Environment-based configuration
- HTTPS support in production
- Rate limiting and CORS protection

## 📊 Services

### Trading Engine (Port 8000)
- Core trading logic and order management
- Strategy execution
- Risk management
- Position tracking

### Market Data Service (Port 8001)
- Real-time price feeds
- Historical data
- Technical indicators
- WebSocket streaming

### API Gateway (Port 3000)
- Request routing
- Authentication
- Rate limiting
- WebSocket proxy

### Web UI (Port 3001)
- Trading dashboard
- Portfolio management
- Strategy configuration
- Real-time charts

## 🧪 Development

### Running Tests
```bash
# Python services
docker-compose exec trading-engine pytest
docker-compose exec market-data pytest

# Node.js services
docker-compose exec api-gateway npm test
docker-compose exec web-ui npm test
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f trading-engine
```

### Accessing Databases
```bash
# PostgreSQL
docker-compose exec postgres psql -U jware_trader -d jware_trader_db

# Redis
docker-compose exec redis redis-cli
```

## 🚀 Deployment

See [docs/deployment.md](docs/deployment.md) for production deployment instructions.

## 📝 API Documentation

- Trading Engine API: http://localhost:8000/docs
- Market Data API: http://localhost:8001/docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes only. Trading cryptocurrencies and other financial instruments carries significant risk. Always do your own research and never invest more than you can afford to lose.

## 🆘 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/yourusername/Jware-Trader4/issues)
- Discord: [Join our community](https://discord.gg/your-invite)

---

Built with ❤️ by the Jware team