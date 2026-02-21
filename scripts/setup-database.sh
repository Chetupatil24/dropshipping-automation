#!/bin/bash

# Database Setup Script for Dropshipping Automation
# This script will create the PostgreSQL user and database

echo "=== Database Setup for Dropshipping Automation ==="
echo ""

# Create PostgreSQL user with your system username
echo "Creating PostgreSQL user 'chetan-patil'..."
sudo -u postgres psql -c "CREATE USER \"chetan-patil\" WITH CREATEDB LOGIN;"

# Create the database
echo "Creating database 'dropshipping_db'..."
sudo -u postgres psql -c "CREATE DATABASE dropshipping_db OWNER \"chetan-patil\";"

# Grant privileges
echo "Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dropshipping_db TO \"chetan-patil\";"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now start the application with: ./start.sh"
