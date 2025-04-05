# Healthcare Management System

A full-stack healthcare management system built with React and Node.js using a microservices architecture.

## Features

- User Authentication (Doctors and Patients)
- Appointment Management
- Medical Records Management
- File Upload Support
- Role-based Access Control
- Responsive Design

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Context API for State Management

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Microservices Architecture

## Services

1. Authentication Service
2. Appointment Service
3. Medical Records Service

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Soufyan909/myheart-project.git
cd myheart-project
```

2. Install dependencies for each service:
```bash
# Frontend
cd frontend
npm install

# Auth Service
cd ../auth-service
npm install

# Appointment Service
cd ../appointment-service
npm install

# Medical Records Service
cd ../medical-records-service
npm install
```

3. Create .env files for each service with the following variables:
```
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001

# Auth Service (.env)
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Appointment Service (.env)
PORT=3002
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Medical Records Service (.env)
PORT=3003
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the services:

Using Docker:
```bash
docker-compose up --build
```

Or without Docker:
```bash
# From the project root
./start.sh
```

## Usage

1. Access the application at http://localhost:3000
2. Register as a doctor or patient
3. Login to access the dashboard
4. Manage appointments and medical records

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
