#!/bin/bash

echo "============================================"
echo "     Jware Trader Logs Viewer"
echo "============================================"

# Function to show logs for a specific service
show_service_logs() {
    local service=$1
    local lines=${2:-50}
    
    echo -e "\n--- $service Logs (last $lines lines) ---"
    docker logs --tail $lines jware-$service 2>&1 | grep -E "(ERROR|WARNING|INFO)" || echo "No logs found for $service"
}

# Function to follow all logs in real-time
follow_all_logs() {
    echo -e "\n[INFO] Following all service logs in real-time (Ctrl+C to stop)..."
    docker-compose logs -f --tail=100
}

# Function to export logs
export_logs() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local export_dir="logs_export_$timestamp"
    
    echo -e "\n[INFO] Exporting logs to $export_dir..."
    mkdir -p $export_dir
    
    for service in postgres redis trading-engine market-data api-gateway web-ui; do
        echo "Exporting $service logs..."
        docker logs jware-$service > "$export_dir/${service}.log" 2>&1
    done
    
    echo "[SUCCESS] Logs exported to $export_dir/"
}

# Main menu
if [ "$1" == "follow" ]; then
    follow_all_logs
elif [ "$1" == "export" ]; then
    export_logs
elif [ "$1" == "errors" ]; then
    echo -e "\n[INFO] Showing only ERROR logs..."
    for service in trading-engine market-data api-gateway web-ui; do
        echo -e "\n--- $service ERRORS ---"
        docker logs jware-$service 2>&1 | grep "ERROR" || echo "No errors found"
    done
else
    # Show recent logs for all services
    echo -e "\n[INFO] Showing recent logs for all services..."
    
    show_service_logs "postgres" 20
    show_service_logs "redis" 20
    show_service_logs "trading-engine" 50
    show_service_logs "market-data" 50
    show_service_logs "api-gateway" 50
    show_service_logs "web-ui" 50
    
    echo -e "\n============================================"
    echo "Usage:"
    echo "  ./scripts/view-logs.sh          # Show recent logs"
    echo "  ./scripts/view-logs.sh follow   # Follow logs in real-time"
    echo "  ./scripts/view-logs.sh errors   # Show only errors"
    echo "  ./scripts/view-logs.sh export   # Export all logs to files"
    echo "============================================"
fi