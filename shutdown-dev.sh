#!/bin/bash

# Travel Buddy Development Shutdown Script
# This script stops both the backend and frontend servers

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Travel Buddy Development Environment ===${NC}"
echo -e "${YELLOW}Shutting down servers...${NC}"
echo

# Function to kill processes using a specific port
kill_port() {
  local port=$1
  local pid=$(lsof -t -i :$port)
  
  if [ -n "$pid" ]; then
    echo -e "${YELLOW}Killing process $pid using port $port...${NC}"
    kill -9 $pid 2>/dev/null
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Successfully killed process on port $port.${NC}"
    else
      echo -e "${RED}Failed to kill process on port $port.${NC}"
    fi
  else
    echo -e "${BLUE}No process found using port $port.${NC}"
  fi
}

# Kill backend server (port 5002)
echo -e "${YELLOW}Stopping backend server...${NC}"
kill_port 5002

# Kill frontend server (port 3000)
echo -e "${YELLOW}Stopping frontend server...${NC}"
kill_port 3000

echo
echo -e "${GREEN}=== All servers stopped ===${NC}"
