# Password Manager

This repository contains a password manager application built using the MERN stack (MongoDB, Express, React, Node.js).

---

## ⚠️ Disclaimer

This application is **not a production-ready password manager** and should **not be used to store real or sensitive credentials**.

It exists solely to showcase:
- Full-stack JavaScript development
- Secure handling concepts
- Testing and CI/CD fundamentals

## Description
 This application allows for users to generate and manage passwords that are encrypted and stored into MongoDB. Passwords are encrypted using AES encryption which can be manually chosen by the user if desired.

### Frontend
- Built with React
- Handles UI, form input, and client-side logic
- Communicates with the backend via HTTP API calls

### Backend
- Built with Node.js and Express
- Exposes REST API endpoints
- Handles password generation, encryption, and decryption
- Uses MongoDB for data storage
- Includes automated tests using Jest
 
### 🧪 Testing
Backend tests are located in the `server/tests` directory

## How to use
 This application requires a MongoDB server which can be downloaded at https://www.mongodb.com/try/download/community. The server connection should be inserted into \server\db\index.js. The server can be started using node index.js in \server\ and the client can be started using npm start in \client\. A cors addon may be needed in your browser.
 
## Dependencies
 This application requires the following: react, axios, mongoose, express, body-parser, styled-components, react-router-dom, react-table-6, bootstrap.
 
## Live Demo
![password-manager](https://user-images.githubusercontent.com/49249379/130858917-4cdde4bc-e331-46f1-961d-46cfc5a56032.gif)


  
