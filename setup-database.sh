#!/bin/bash
# Database Setup Script for Ruthan Dropshipping Platform

echo "========================================="
echo "Ruthan Database Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up PostgreSQL database...${NC}"

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}Starting PostgreSQL service...${NC}"
    sudo systemctl start postgresql
fi

# Create database and user
echo -e "${YELLOW}Creating database and user...${NC}"

sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'chetan-patil') THEN
      CREATE USER "chetan-patil" WITH PASSWORD 'ruthan2026secure';
   END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE dropshipping_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dropshipping_db')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dropshipping_db TO "chetan-patil";

-- Connect to the database
\c dropshipping_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO "chetan-patil";

\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database setup complete!${NC}"
    echo ""
    echo "Database: dropshipping_db"
    echo "User: chetan-patil"
    echo "Password: ruthan2026secure"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. cd backend && npm start"
    echo "2. Frontend already running on http://localhost:3000"
    echo ""
else
    echo -e "${RED}✗ Database setup failed${NC}"
    echo "Please run manually:"
    echo "sudo -u postgres psql"
    echo "Then execute the SQL commands in this script"
    exit 1
fi
