#!/usr/bin/env node

/**
 * System Health Check Script
 * Verifies all dependencies and services before starting the application
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SystemChecker {
    constructor() {
        this.checks = [];
        this.failed = false;
    }

    log(message, type = 'info') {
        const symbols = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        };
        const colors = {
            success: '\x1b[32m',
            error: '\x1b[31m',
            info: '\x1b[34m',
            warning: '\x1b[33m'
        };
        const reset = '\x1b[0m';

        console.log(`${colors[type]}${symbols[type]} ${message}${reset}`);
    }

    // Check Node.js version
    checkNodeVersion() {
        try {
            const version = process.version;
            const major = parseInt(version.slice(1).split('.')[0]);

            if (major >= 18) {
                this.log(`Node.js version: ${version}`, 'success');
                return true;
            } else {
                this.log(`Node.js version ${version} is too old. Requires 18+`, 'error');
                this.failed = true;
                return false;
            }
        } catch (error) {
            this.log(`Failed to check Node.js version: ${error.message}`, 'error');
            this.failed = true;
            return false;
        }
    }

    // Check if PostgreSQL is running
    checkPostgreSQL() {
        try {
            execSync('psql --version', { stdio: 'ignore' });
            this.log('PostgreSQL client installed', 'success');
            return true;
        } catch (error) {
            this.log('PostgreSQL client not found', 'error');
            this.failed = true;
            return false;
        }
    }

    // Check if Redis is running
    checkRedis() {
        try {
            execSync('redis-cli ping', { stdio: 'pipe', encoding: 'utf-8' });
            this.log('Redis is running', 'success');
            return true;
        } catch (error) {
            this.log('Redis is not running or not installed', 'error');
            this.failed = true;
            return false;
        }
    }

    // Check if .env file exists
    checkEnvFile() {
        const envPath = path.join(__dirname, '..', '.env');
        if (fs.existsSync(envPath)) {
            this.log('.env file exists', 'success');
            return true;
        } else {
            this.log('.env file not found. Copy .env.example to .env', 'error');
            this.failed = true;
            return false;
        }
    }

    // Check if node_modules exists
    checkDependencies() {
        const paths = [
            path.join(__dirname, '..', 'node_modules'),
            path.join(__dirname, '..', 'frontend', 'node_modules'),
            path.join(__dirname, '..', 'admin-dashboard', 'node_modules')
        ];

        let allExist = true;
        paths.forEach((p, index) => {
            const names = ['Backend', 'Frontend', 'Admin Dashboard'];
            if (fs.existsSync(p)) {
                this.log(`${names[index]} dependencies installed`, 'success');
            } else {
                this.log(`${names[index]} dependencies missing. Run: npm install`, 'error');
                allExist = false;
                this.failed = true;
            }
        });

        return allExist;
    }

    // Check required directories
    checkDirectories() {
        const dirs = ['logs', 'backend', 'frontend', 'admin-dashboard'];
        let allExist = true;

        dirs.forEach(dir => {
            const dirPath = path.join(__dirname, '..', dir);
            if (fs.existsSync(dirPath)) {
                this.log(`Directory '${dir}' exists`, 'success');
            } else {
                this.log(`Directory '${dir}' missing`, 'error');
                allExist = false;
                this.failed = true;
            }
        });

        return allExist;
    }

    // Run all checks
    async run() {
        console.log('\n=== Dropshipping Automation System Check ===\n');

        console.log('Checking prerequisites...\n');
        this.checkNodeVersion();
        this.checkPostgreSQL();
        this.checkRedis();
        console.log('');

        console.log('Checking project setup...\n');
        this.checkEnvFile();
        this.checkDependencies();
        this.checkDirectories();
        console.log('');

        // Summary
        console.log('=== Summary ===\n');
        if (this.failed) {
            this.log('System check FAILED. Please fix the errors above.', 'error');
            console.log('\nNext steps:');
            console.log('  1. Install missing dependencies');
            console.log('  2. Start required services (PostgreSQL, Redis)');
            console.log('  3. Create .env file from .env.example');
            console.log('  4. Run this check again\n');
            process.exit(1);
        } else {
            this.log('System check PASSED. Ready to start!', 'success');
            console.log('\nTo start the application:');
            console.log('  ./start.sh (Linux/Mac)');
            console.log('  start.bat (Windows)\n');
            process.exit(0);
        }
    }
}

// Run checks
const checker = new SystemChecker();
checker.run().catch(error => {
    console.error('System check failed with error:', error);
    process.exit(1);
});
