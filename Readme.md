
# Bolt Vote App

## Overview

The **Bolt Vote App** is a full-stack web application that supports real-time voting functionality. It includes a backend powered by Node.js and Express and a React-based frontend styled with TailwindCSS. The app uses Socket.io for real-time communication.

---

## Features

- Secure backend with JWT-based authentication.
- Real-time voting powered by Socket.io.
- MongoDB as the database.
- TypeScript support for both frontend and backend.
- Modular codebase for easy development.

---

## Prerequisites

Ensure you have the following installed on your local system:

1. **Node.js** (v16 or later)
2. **npm** (v8 or later)
3. **MongoDB** (local or cloud instance)
4. **Git** (for cloning the repository)

---

## Project Structure

```
project/
├── backend/           # Backend service
├── frontend/          # Frontend service
├── package.json       # Root package file for scripts
├── tsconfig.json      # TypeScript configuration
└── ...                # Additional configuration files
```

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd project
   ```

2. Install root dependencies:

   ```bash
   npm install
   ```

3. Install dependencies for backend and frontend:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. Configure environment variables:

   - Backend: Create a `.env` file in the `backend/` directory based on `.env.example`:

     ```
     PORT=3002
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     NODE_ENV=development
     ```

---

## Running the Project

1. **Development Mode**:

   Run both backend and frontend concurrently:

   ```bash
   npm run dev
   ```

   - Backend runs on `http://localhost:3002`
   - Frontend runs on `http://localhost:3001`

2. **Individual Services**:

   - Start backend:

     ```bash
     cd backend
     npm run dev
     ```

   - Start frontend:

     ```bash
     cd frontend
     npm run dev
     ```

3. **Build Frontend**:

   ```bash
   cd frontend
   npm run build
   ```

---

## Key Technologies

- **Frontend**: React, Redux Toolkit, TailwindCSS, Vite
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Tooling**: TypeScript, ESLint, Prettier

---

## Contributing

Feel free to open issues and submit pull requests for improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

For queries or support, contact the project maintainers.

