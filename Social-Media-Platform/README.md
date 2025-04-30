# Social Media Platform Project
# Group Members: Ahmed W., Maleek E.

AMusic

Overview

A Social Media Platform built using the MERN stack and Vite. Core features include posting, authentication, following, liking, commenting, notifications, and profile management.


Tech Stack

  Frontend: React.js (Vite), Tailwind CSS, React Router
  Backend: Node.js, Express.js
  Database: MongoDB (Mongoose)
  Authentication: JWT
  Deployment: Render


Features

  User authentication (JWT).
  Create, like, comment, and delete posts.
  Follow/unfollow users.
  Notifications.
  Profile updates (bio, avatar, password, images).


Setup Instructions

  Prerequisites: Node.js, npm/yarn, MongoDB, Cloudinary account.
  
  Steps:
    Clone the repository:
      git clone https://github.com/ahmxxdd/AM-Music 
      cd AM-Music
  
  Backend:
    Navigate to backend:
      cd backend
      npm install
    Create a .env file:
      MONGO_URI = (put your connection string here)
      PORT = 5000
      JWT_SECRET = (put your JWT secret here)
      NODE_ENV = development
      CLOUDINARY_CLOUD_NAME = (put your cloudinary cloud name here)
      CLOUDINARY_API_KEY = (put your cloudinary api key here)
      CLOUDINARY_API_SECRET = (put your cloudinary api secret here)
    Start the server:
      nodemon server.js
  Frontend:
    Navigate to frontend:
      cd frontend
      npm install
    Start the frontend:
      npm run dev



