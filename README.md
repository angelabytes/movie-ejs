# movie-ejs

Server-side rendering using EJS

# Movie Review Web Application

## Description

This is a web application built with Node.js, Express, and Mongoose that allows users to manage movie data and potentially add reviews. It's designed as a foundation for a full-featured movie review platform.

## Features

- **User Authentication:** Includes user registration and login functionality with secure password hashing and JWT for session management.
- **Movie Management:**
  Allows storing movie details like title, director, year, and plot. Includes basic validation for movie data.
- **Review System:** Supports adding reviews for movies, including review text and a rating. Includes validation for review data.
- **Session Handling:** Uses `express-session` and `connect-mongodb-session` to manage user sessions, persisting session data in MongoDB.
- **Flash Messages:** Implements `connect-flash` for displaying temporary messages (like errors or info) to the user after redirects.
- **Basic Server Setup:** Configured with Express, environment variable loading (`dotenv`), and basic error handling.
- **Templating:** Uses EJS for rendering dynamic web pages.

## Technologies Used

- Node.js
- Express.js
- Mongoose (for MongoDB object modeling)
- MongoDB (as the database)
- EJS (Embedded JavaScript templates)
- `dotenv` (for environment variables)
- `express-session`
- `connect-mongodb-session`
- `connect-flash`
- `bcryptjs` (for password hashing)
- `jsonwebtoken` (for JWT)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project. Add the following variables:
    ```env
    MONGO_URI=<Your MongoDB connection string>
    SESSION_SECRET=<A strong, random string for session secret>
    JWT_SECRET=<A strong, random string for JWT secret>
    JWT_LIFETIME=1d # Example: Token expires in 1 day
    PORT=3000 # Or any port you prefer
    ```
    Replace the placeholder values with your actual MongoDB connection string and strong secrets.
4.  **Start the MongoDB server:** Ensure your MongoDB instance is running.
5.  **Run the application:**
    ```bash
    npm start # Or node server.js / app.js depending on your main file name
    ```

## How to Run

After completing the setup steps, run `npm start` (or the appropriate command) in your terminal from the project's root directory. The server should start, and you can access the application in your web browser at `http://localhost:<PORT>` (replace `<PORT>` with the port number specified in your `.env` file, default is 3000).

## Project Structure

.
├── controllers/
├── db/
│ └── connect.js
├── middleware/
├── models/
│ ├── Movie.js
│ ├── Review.js
│ └── User.js
├── routes/
├── utils/
├── views/
│ ├── partials/
│ │ ├── head.ejs
│ │ ├── header.js
│ │ └── footer.js
│ └── secretWord.js
├── .gitignore
├── app.js
└── README.md
