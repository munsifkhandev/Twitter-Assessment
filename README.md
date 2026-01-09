# Twitter-Assessment

# Full Stack Twitter Clone (MERN)

A fully functional social media application built with the **MERN Stack** (MongoDB, Express, React, Node.js). This project replicates core Twitter features, allowing users to tweet, like, follow others, and view dynamic profiles with pagination.

## Features

### 🔐 Authentication & Security

- **User Registration & Login:** Secure authentication using **JWT (JSON Web Tokens)**.
- **Password Hashing:** Passwords are hashed using **Bcrypt** for security.
- **Protected Routes:** Only authenticated users can access the timeline and interactions.

### 📝 Tweet Management

- **Create Tweets:** Post updates instantly.
- **Delete Tweets:** Users can delete their own tweets.
- **Pagination:** Optimized timeline loading (10 tweets per page) with "Load More" functionality for better performance.

### ❤️ Interactions

- **Like/Unlike:** Real-time optimistic UI updates for likes.
- **Follow System:** Follow and unfollow users to curate your timeline.
- **Dynamic Counters:** Follower and Following counts update dynamically on profiles.

### 👤 User Profiles

- **My Profile:** View your own tweets and stats.
- **Public Profiles:** Click on any user's name/avatar to view their specific profile and tweets.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **React.js (Vite):** Fast and modern UI library.
- **TypeScript:** For type safety and better developer experience.
- **Tailwind CSS:** For responsive and modern styling.
- **Axios:** For handling API requests.
- **React Router DOM:** For seamless navigation.
- **React Hot Toast:** For beautiful notifications.

### Backend (Server)

- **Node.js & Express.js:** RESTful API architecture.
- **MongoDB & Mongoose:** NoSQL database for flexible data storage.
- **JWT & Bcrypt:** For secure authentication.
- **Cors & Dotenv:** Middleware configuration.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/munsifkhandev/twitter-clone.git](https://github.com/munsifkhandev/Twitter-Assessment.git)

cd twitter-clone
```

### 2. Backend Setup

Navigate to the server folder and install dependencies.

```bash

cd server
npm install
```

Create a .env file in the server directory and add the following:

```bash

PORT= Enter your Port Number
MONGO_URL= Enter your Connection String
JWT_SECRET= Enter your Secret Key
```

Start the server:

```bash

npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the client folder, and install dependencies.

```bash

cd client
npm install
```

Start the React app:

```bash

npm run dev

```

### 4. Open in Browser

Visit http://localhost:5173 in your browser.

## 🔌 API Endpoints

| Method   | Endpoint                | Description                         |
| :------- | :---------------------- | :---------------------------------- |
| `POST`   | `/api/auth/register`    | Register a new user                 |
| `POST`   | `/api/auth/login`       | Login user & get Token              |
| `GET`    | `/api/tweets`           | Get all tweets (Pagination support) |
| `POST`   | `/api/tweets`           | Create a new tweet                  |
| `DELETE` | `/api/tweets/:id`       | Delete a tweet                      |
| `PUT`    | `/api/tweets/:id/like`  | Like/Unlike a tweet                 |
| `GET`    | `/api/users/:id`        | Get user profile info               |
| `PUT`    | `/api/users/:id/follow` | Follow/Unfollow a user              |

## Author

Munsif Khan
Twitter Assessment Task
