#!/bin/bash

# Travel Buddy Development Startup Script
# This script starts both the backend and frontend servers for development

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Travel Buddy Development Environment ===${NC}"
echo -e "${BLUE}Starting backend and frontend servers...${NC}"
echo

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
if ! command_exists node; then
  echo -e "${RED}Error: Node.js is not installed. Please install Node.js to continue.${NC}"
  exit 1
fi

if ! command_exists npm; then
  echo -e "${RED}Error: npm is not installed. Please install npm to continue.${NC}"
  exit 1
fi

# Set the base directory to the script's location
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend/web"

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo -e "${YELLOW}Installing backend dependencies...${NC}"
  cd "$BACKEND_DIR" && npm install
  cd "$BASE_DIR"
fi

# Install frontend web dependencies if node_modules doesn't exist
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo -e "${YELLOW}Installing frontend web dependencies...${NC}"
  cd "$FRONTEND_DIR" && npm install
  cd "$BASE_DIR"
fi

# Start the backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd "$BACKEND_DIR" && npm run dev &
BACKEND_PID=$!
cd "$BASE_DIR"

# Wait a moment for the backend to start
sleep 2

# Start the frontend web server
echo -e "${GREEN}Starting frontend web server...${NC}"
cd "$FRONTEND_DIR" && npm start &
FRONTEND_PID=$!
cd "$BASE_DIR"

# Function to handle script termination
cleanup() {
  echo -e "\n${YELLOW}Shutting down servers...${NC}"
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo -e "${GREEN}Servers stopped.${NC}"
  exit 0
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

echo
echo -e "${GREEN}=== Servers are running ===${NC}"
echo -e "${BLUE}Backend:${NC} http://localhost:5002"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Keep the script running
wait
