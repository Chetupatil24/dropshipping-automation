#!/usr/bin/env node

/**
 * Quick Environment Setup Helper
 * Helps configure .env file with required API keys
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
    console.log('\n=== Dropshipping Automation - Environment Setup ===\n');

    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');

    // Check if .env already exists
    if (fs.existsSync(envPath)) {
        const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Setup cancelled.');
            rl.close();
            return;
        }
    }

    console.log('\nI\'ll help you configure the essential settings.\n');
    console.log('Press Enter to skip optional fields.\n');

    // Database settings
    console.log('--- Database Configuration ---');
    const dbHost = await question('PostgreSQL host [localhost]: ') || 'localhost';
    const dbPort = await question('PostgreSQL port [5432]: ') || '5432';
    const dbName = await question('Database name [dropshipping_db]: ') || 'dropshipping_db';
    const dbUser = await question('Database user [postgres]: ') || 'postgres';
    const dbPassword = await question('Database password: ');

    // JWT Secret
    console.log('\n--- Security ---');
    const jwtSecret = await question('JWT Secret (min 32 chars) [auto-generate]: ') ||
        require('crypto').randomBytes(32).toString('hex');

    // Redis
    console.log('\n--- Redis ---');
    const redisHost = await question('Redis host [localhost]: ') || 'localhost';
    const redisPort = await question('Redis port [6379]: ') || '6379';

    // Payment Gateway
    console.log('\n--- Payment Gateway (Optional) ---');
    const razorpayKeyId = await question('Razorpay Key ID: ');
    const razorpayKeySecret = await question('Razorpay Key Secret: ');
    const razorpayWebhookSecret = await question('Razorpay Webhook Secret: ');

    // Shipping
    console.log('\n--- Shipping (Optional) ---');
    const shiprocketEmail = await question('Shiprocket Email: ');
    const shiprocketPassword = await question('Shiprocket Password: ');

    // Email
    console.log('\n--- Email Notifications (Optional) ---');
    const emailHost = await question('SMTP Host (e.g., smtp.gmail.com): ');
    const emailPort = await question('SMTP Port [587]: ') || '587';
    const emailUser = await question('Email User: ');
    const emailPassword = await question('Email Password/App Password: ');

    // Build .env content
    let envContent = `# Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}

# Redis Configuration
REDIS_HOST=${redisHost}
REDIS_PORT=${redisPort}

# JWT Secret
JWT_SECRET=${jwtSecret}

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

`;

    if (razorpayKeyId || razorpayKeySecret) {
        envContent += `# Razorpay Payment Gateway\n`;
        envContent += `RAZORPAY_KEY_ID=${razorpayKeyId}\n`;
        envContent += `RAZORPAY_KEY_SECRET=${razorpayKeySecret}\n`;
        envContent += `RAZORPAY_WEBHOOK_SECRET=${razorpayWebhookSecret}\n\n`;
    }

    if (shiprocketEmail || shiprocketPassword) {
        envContent += `# Shiprocket Shipping\n`;
        envContent += `SHIPROCKET_EMAIL=${shiprocketEmail}\n`;
        envContent += `SHIPROCKET_PASSWORD=${shiprocketPassword}\n\n`;
    }

    if (emailHost || emailUser) {
        envContent += `# Email Configuration\n`;
        envContent += `EMAIL_HOST=${emailHost}\n`;
        envContent += `EMAIL_PORT=${emailPort}\n`;
        envContent += `EMAIL_USER=${emailUser}\n`;
        envContent += `EMAIL_PASSWORD=${emailPassword}\n\n`;
    }

    // Add placeholders for supplier integrations
    envContent += `# Supplier Integrations (Optional)
# Get these from respective supplier platforms
ALIEXPRESS_API_KEY=
ALIEXPRESS_API_SECRET=
CJ_DROPSHIP_API_KEY=
CJ_DROPSHIP_EMAIL=
CJ_DROPSHIP_PASSWORD=
INDIAMART_API_KEY=

# Twilio (Optional - for SMS/WhatsApp)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Anthropic AI (Optional - for chatbot)
ANTHROPIC_API_KEY=
`;

    // Write to file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment file created successfully!\n');
    console.log('📄 File location: .env\n');
    console.log('Next steps:');
    console.log('  1. Add supplier API keys (optional)');
    console.log('  2. Run: ./start.sh');
    console.log('  3. Create admin user (see SETUP.md)\n');

    rl.close();
}

setupEnvironment().catch(error => {
    console.error('Setup failed:', error);
    rl.close();
    process.exit(1);
});
