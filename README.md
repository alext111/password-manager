# Password Manager

A full-stack password manager built with the MERN stack (MongoDB, Express, React, Node.js) that demonstrates secure credential storage concepts, REST API design, testing, and cloud deployment practices.

## ⚠️ Disclaimer

This application is **not a production-ready password manager** and should **not be used to store real or sensitive credentials**.

It exists to showcase:
- Full-stack JavaScript development
- Secure data handling concepts
- Testing and CI/CD fundamentals
- Automated testing
- Containerization and cloud deployment

## Description
The application allows users to generate, encrypt, store, and retrieve passwords through a web interface.

Key features include:

- Secure password generation
- AES-based encryption before storage
- Encrypted password storage in MongoDB
- Full CRUD operations for password entries
- REST API architecture
- Automated frontend and backend testing

## Architecture
<img width="540" height="1177" alt="User Browser to MongoDB Flow" src="https://github.com/user-attachments/assets/40a9a439-7db9-4d97-9026-f3259758dc90" />


## Tech Stack

### Frontend

- React
- Axios
- React Router
- Styled Components
- Bootstrap

Responsibilities:

- User interface and form handling
- Password management dashboard
- Communication with backend API

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

Responsibilities:

- REST API endpoints
- Password generation logic
- AES encryption and decryption
- Database persistence

### Testing

- Jest

#### Frontend
Test coverage includes:

- Component rendering
- User interactions
- API integration behavior

#### Backend
Test coverage includes:

- API endpoint behavior
- Password generation logic
- Encryption functionality
- Database interactions


## Cloud Deployment (AWS)

The application is deployed on Amazon Web Services (AWS) using an EC2 instance.

Infrastructure components include:

### EC2
Runs the Node.js backend and serves the React frontend.

### Nginx

Configured as a reverse proxy to:

- Handle HTTPS traffic
- Forward requests to the Node.js application
- Improve security and performance

### SSL / HTTPS
Traffic is secured using HTTPS certificates.

### Domain Configuration
The application is accessible through a custom domain.


## CI/CD Pipeline

A GitHub Actions workflow automatically builds and tests the application.

### Continuous Integration

On every push:

- Install dependencies
- Run backend tests
- Run frontend tests
- Validate build

### Continuous Deployment

Successful builds trigger deployment to the AWS EC2 instance where the updated application is pulled and restarted.


## Running the Project Locally
### Prerequisites

- Node.js
- MongoDB

MongoDB Community Server can be downloaded here:
https://www.mongodb.com/try/download/community

1. Clone the repository
    git clone https://github.com/alext111/password-manager.git
    cd password-manager

2. Install dependencies
    cd server
    npm install

    cd ../client
    npm install

3. Configure MongoDB

    Update the database connection in:
    server/db/index.js

    Example:
    mongodb://localhost:27017/password-manager

4. Start the application

    Backend:

    cd server
    node index.js

    Frontend:

    cd client
    npm start

## Live Demo
![Live Demo](./client/src/pmdemo.gif)
