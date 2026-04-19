# 100974825 COMP3133 Assignment 2
Full-stack Employee Management System built with Angular, Node.js, GraphQL, and MongoDB.

---

## Tech Stack

**Backend**
- Node.js + Express
- Apollo Server (GraphQL)
- MongoDB Atlas + Mongoose
- JWT Authentication
- Cloudinary (employee photo uploads)

**Frontend**
- Angular 17
- Apollo Angular (GraphQL client)
- Bootstrap 5 + Bootstrap Icons

---


## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [Angular CLI](https://angular.io/cli) v17 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster
- A [Cloudinary](https://cloudinary.com/) account

---

## Backend Setup

### 1. Install dependencies

```bash
cd 100974825_comp3133_assignment2/backend
npm install
```

### 2. Create the `.env` file

Create a file called `.env` in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/comp3133
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4000
```

Replace each value with your own credentials:
- `MONGO_URI` — get this from MongoDB Atlas
- `JWT_SECRET` — any long random string
- `CLOUDINARY` — get these from your Cloudinary dashboard

### 3. Run the backend

```bash
npm start
```

You should see:
```
MongoDB connected
Server running at http://localhost:4000/graphql
```

You can test the GraphQL API by visiting `http://localhost:4000/graphql` in your browser.

---

## Frontend Setup

### 1. Install dependencies

```bash
cd 100974825_comp3133_assignment2/frontend
npm install
```

### 2. Check the environment file

Open `src/environments/environment.ts` and confirm the GraphQL URI points to your local backend:

```typescript
export const environment = {
  production: false,
  graphqlUri: 'http://localhost:4000/graphql',
};
```

### 3. Run the frontend

```bash
ng serve
```

Open `http://localhost:4200` in your browser.

---

## Running Locally (Both Servers)

You need two terminal tabs running at the same time:

**Terminal 1 — Backend**
```bash
cd 100974825_comp3133_assignment2/backend
npm start
```

**Terminal 2 — Frontend**
```bash
cd 100974825_comp3133_assignment2/frontend
ng serve
```

Then visit `http://localhost:4200`.

---

## Features

- **Signup / Login** — create an account and sign in with username or email
- **Employee List** — view all employees in a table with avatar, salary, and join date
- **Search** — filter employees by department or designation
- **Add Employee** — form with photo upload (uploaded to Cloudinary via backend)
- **Edit Employee** — pre-filled form to update any employee field
- **View Details** — modal popup with full employee information
- **Delete Employee** — remove an employee with a confirmation prompt
- **Logout** — clears session and redirects to login

---

## GraphQL API Reference

**Endpoint:** `http://localhost:4000/graphql`

All employee queries and mutations require a valid JWT