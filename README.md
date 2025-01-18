# Clerk Authentication and User Management

## Overview
This project implements **user authentication** and **management** using **Clerk** and **MongoDB**. It allows creating, updating, and deleting user accounts via Clerk’s API, and manages user data within MongoDB. Additionally, it utilizes **webhooks** to sync user data between Clerk and the local database.

---

## Features

- **1. User Registration:** Users can sign up with their email, phone number, and password.
- **2. User Update:** Users can update their profile information.
User Deletion: Admins can delete users.
- **3. Clerk Integration:** Full integration with Clerk for user authentication and management.
- **4. Webhook Handling:** Syncs Clerk events such as user creation, updates, and deletion with MongoDB.
- **5. MongoDB Integration:** All user data is stored and managed in MongoDB.
- **6. API-based Architecture:** RESTful APIs are used for user operations.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk API
- **Security:** `Helmet`, `Express Rate Limiting`, `CORS`
- **Other Libraries:** `dotenv` for environment variable management, `svix` for webhook handling

---


## Project Structure

```bash

omkarranu3625-clerk_user_auth/
├── index.js                    # Entry point of the application
├── package.json                # Project dependencies and scripts
├── config/
│   └── configDB.js             # MongoDB connection configuration
├── controllers/
│   └── auth.js                 # Controller for user-related operations
├── middleware/
│   └── webhook.js              # Middleware for handling Clerk webhooks
├── models/
│   └── User.js                 # User schema for MongoDB
└── routes/
    └── auth.js                 # Authentication routes

```
---


## Environment Variables

Create a **.env** file in the root directory and add the following environment variables:

- **PORT:** The port on which the server runs.
- **MONGO_URI:** MongoDB connection string.
- **CLERK_WEBHOOK_SECRET:** Webhook secret from Clerk Dashboard.
- **CLERK_API_KEY:** Clerk API key for creating and managing users.
Example .env file:

```

PORT=5003
MONGO_URI=<your-mongodb-connection-string>
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
CLERK_API_KEY=<your-clerk-api-key>

```

## Setup Instructions

### 1. Clone the Repository

```bash

git clone https://github.com/omkarRanu3625/clerk_user_auth.git
cd clerk_user_auth

```

### 2. Install Dependencies

```bash

npm install

```

### 3. Configure Environment

Create a `.env` file in the project root and configure it with your `MongoDB URI` and `Clerk credentials`.


### 4. Start the Application

```bash

node index.js

```

The server will be running at http://localhost:5003.

---

## API Endpoints

### User Management

`POST /api/auth/signup:` Create a new user
`POST /api/auth/update:` Update an existing user
`DELETE /api/auth/delete:` Delete a user

---

## Clerk Webhooks

### Webhook Event Handling

The application listens for webhook events (e.g., `user.created`, `user.updated`, `user.deleted`) from Clerk. When these events occur, the corresponding user data is synced with MongoDB.

### Webhook Setup

#### Step 1: Set Up Ngrok

- Create an account on [Ngrok](https://ngrok.com/) if you don't have one.
- Follow the **ngrok** installation guide to install it on your local system.
- Once installed, run the following command in your terminal to start a tunnel for your local server:

```bash
ngrok http 5002

```
- This will give you a public URL (e.g., https://fawn-two-nominally.ngrok-free.app) that can be used to send webhook payloads to your local server.

#### Step 2: Set Up Clerk Webhook

- Log in to your **Clerk Dashboard**.
- Navigate to the **Webhooks** page and click **Add Endpoint**.
- In the Endpoint URL field, paste the URL from **Ngrok,** followed by **/api/webhooks** (e.g., https://146f-106-219-121-105.ngrok-free.app/api/webhooks).
- Under Subscribe to events, select `user.created`, `user.updated` and `user.deleted` (or other events as needed).
- Copy the Signing Secret and save it to your **.env.local** file, like this:

```
SIGNING_SECRET=whsec_1234567890abcdef

```

#### Step 3: Install Required Packages

Install the necessary dependencies:

```bash

npm install @clerk/express svix

```
#### Package

**1. @clerk/clerk-sdk-node** – Clerk SDK to interact with the Clerk API.
**2. svix** – Used for **webhook** signature verification.

#### Add **.env file**

```
CLERK_PUBLISHABLE_KEY= your_publishable_key
CLERK_SECRET_KEY= your_api_key
CLERK_WEBHOOK_SECRET= your_webhook_singing_key

```

---

## License
This project is licensed under the **MIT** License. See the LICENSE file for details.