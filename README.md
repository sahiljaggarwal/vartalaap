# Vartalaap Chat API

## Overview

Vartalaap is a robust chat API developed using NestJS, MongoDB, WebSockets, JWT, and Google Authentication. This project provides a platform for real-time communication, user authentication, and message storage.

## Technology Used

- **NestJS Framework:**
  - A powerful TypeScript framework for building scalable and modular server-side applications.

- **MongoDB:**
  - A NoSQL database used for storing and managing data related to user profiles and chat messages.

- **WebSockets:**
  - Real-time communication is facilitated through WebSockets, allowing instant messaging between users.

- **JWT (JSON Web Tokens):**
  - Token-based authentication is implemented using JWT for secure user authentication and authorization.

- **Google Authentication:**
  - Users can sign up and sign in securely using their Google accounts, enhancing the authentication process.

## Features

- **Google Authentication:**
  - **Signup/Signin:** Users can authenticate themselves using their Google accounts.

- **Real-time Chat:**
  - **Instant Messaging:** Users can send real-time messages to each other using WebSockets.
  - **Message Storage:** All messages are securely stored in the MongoDB database.

- **User Interaction:**
  - **Search Users:** Users can search for others based on their usernames.
  - **Real-time Connections:** Establishing real-time connections with other users is facilitated through WebSockets.
  - **Online/Offline:** Real-time online/offline status updates ensure users are aware of each other's presence, facilitating better communication.
  - **Last Seen**: Users can view the last seen status of others, providing insights into their activity and availability.

- **Security:**
  - **JWT Authentication:** Token-based authentication ensures a secure and authenticated user experience.
  - **Authorization:** Access to real-time connections and message retrieval is protected, and unauthorized access is restricted.
    

## Key Points

- **WebSockets for Real-time Communication:**
  - WebSockets enable efficient and instant messaging between users, creating a seamless chat experience.

- **JWT for Secure Authentication:**
  - JSON Web Tokens are used to authenticate users securely, providing a token-based authorization mechanism.

- **Google Authentication Integration:**
  - Users can sign up and log in using their Google accounts, enhancing the authentication process.

- **Message Persistence:**
  - All chat messages are stored securely in the MongoDB database, ensuring data persistence and retrieval.

- **Search Functionality:**
  - Users can search for other users based on their usernames, facilitating user interaction.

- **Token-Based Authorization:**
  - Real-time connections and message retrieval are protected by JWT-based authorization, ensuring a secure environment.
 
- **Last Seen**
  - Users can view the last seen status of others, providing insights into their activity and availability.

- **Online/Offline**
  - Real-time online/offline status updates ensure users are aware of each other's presence, facilitating better communication.


## Getting Started

To set up and run the Vartalaap Chat API, follow the instructions provided in the project's documentation.

**Note:** Ensure that you have the required dependencies installed, including Node.js, npm, and MongoDB.

### Getting Started Steps

1. Clone the repository using the following command:
   ```bash
   git clone <repository_link> -b dev

2. Navigate to the project directory:
   ```bash
   cd vartalaap
   ```
3. Install project dependencies:
   ```
   npm install
   ```
4. Create a .env file in the project root and add the following configurations:
  ```
   MONGODB_URI = <your_mongodb_uri>
   SECRET_KEY = <your_secret_key>

   GOOGLE_CLIENT_ID = <your_google_client_id>
   GOOGLE_CLIENT_SECRET = <your_google_client_secret>
   GOOGLE_CALLBACK_URL = <your_google_callback_url>

   URL = http://localhost:4000
```
6. Run the application:
  ```
  npm run start:dev
  ```




