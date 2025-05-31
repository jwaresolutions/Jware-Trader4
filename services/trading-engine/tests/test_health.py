"""
Test health endpoints
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test basic health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "trading-engine"
    assert "version" in data
    assert "environment" in data


def test_liveness_check():
    """Test liveness endpoint"""
    response = client.get("/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "Trading Engine"
    assert data["status"] == "running"
    assert "version" in data
    assert "environment" in data