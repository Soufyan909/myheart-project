#!/bin/bash

# Start API Gateway
echo "Starting API Gateway..."
cd api-gateway
npm install
npm start &

# Start Auth Service
echo "Starting Auth Service..."
cd ../auth-service
npm install
npm start &
AUTH_PID=$!

# Start Appointments Service
echo "Starting Appointments Service..."
cd ../appointment-service
npm install
npm start &
APPOINTMENT_PID=$!

# Start Medical Records Service
echo "Starting Medical Records Service..."
cd ../medical-records-service
npm install
npm start &

# Start Frontend
echo "Starting Frontend..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

# Wait for all background processes
wait $AUTH_PID $APPOINTMENT_PID $FRONTEND_PID 