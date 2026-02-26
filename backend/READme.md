SETUP INSTRUCTIONS

Backend Setup
bash
# Navigate to backend
cd C:\API Demo2\API Demo2\backend

# Install dependencies
npm install

# Create .env file
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=ams_db
# JWT_SECRET=your_secret_key
# JWT_EXPIRES_IN=24h
# JWT_REFRESH_SECRET=your_refresh_secret
# JWT_REFRESH_EXPIRES_IN=7d

# Start server
npm run dev
Database Setup
bash
# Run schema.sql
cd C:\API Demo2\API Demo2\db
mysql -u root -p < schema.sql
Postman Setup
Import Academic_Management_System.postman_collection.json

Import AMS_Local_Environment.postman_environment.json

Select "AMS Local" environment

Run requests in order: Health → Register → Login → Profile → Logout