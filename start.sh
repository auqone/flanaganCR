#!/bin/bash

# Tigerista - Start All Services
# This script starts the frontend, backend, and admin panel

echo ""
echo "========================================"
echo "  Tigerista - Development Server"
echo "========================================"
echo ""
echo "Starting:"
echo "  - Frontend (http://localhost:3000)"
echo "  - Backend API (http://localhost:3000/api)"
echo "  - Admin Panel (http://localhost:3000/admin)"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev
