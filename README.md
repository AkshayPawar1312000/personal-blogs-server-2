# Personal Blog Server

This is the backend server for a personal blog application. The server is built with **Node.js**, **Express**, and **Sequelize** to manage blog posts, including text content and image uploads, stored in a **MySQL** database.

## Features

- Create, read, update, and delete (CRUD) blog posts.
- Image uploads using Multer (image paths are stored in the database).
- Unit testing with Jest.
- User authentication (optional).
  
## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for interacting with the MySQL database.
- **MySQL**: Database to store blog data and image paths.
- **Multer**: Middleware for handling file uploads.
- **Jest**: Testing framework for unit and integration tests.

## Prerequisites

To run this project, you will need to have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v12 or later)
- [MySQL](https://www.mysql.com/)
- A package manager like npm or yarn

## Setup and Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/personal-blog-server.git
    ```

2. Navigate into the project directory:

    ```bash
    cd personal-blog-server
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up the environment variables. Create a `.env` file in the root directory and add the following:

    ```env
    DB_HOST=your_mysql_host
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_database_name
    JWT_SECRET=your_jwt_secret
    ```

5. Run database migrations (if applicable):

    ```bash
    npx sequelize db:migrate
    ```

6. Start the server:

    ```bash
    npm start
    ```

7. The server should now be running on `http://localhost:3000`.

## API Endpoints

Here are some of the available API routes:

### Blog Routes

- `POST /blogs` - Create a new blog post (with image upload).
- `GET /blogs` - Retrieve all blog posts.
- `GET /blogs/:id` - Retrieve a single blog post by ID.
- `PUT /blogs/:id` - Update an existing blog post.
- `DELETE /blogs/:id` - Delete a blog post.

### Authentication Routes

- `POST /users/register` - Register a new user.
- `POST /users/login` - User login and JWT token generation.

## Testing

To run the unit tests with Jest:

```bash
npm test
