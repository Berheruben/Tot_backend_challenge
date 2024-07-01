# Restaurant Reservation API

This project is a RESTful API for managing restaurant reservations. The API allows clients to create users, make reservations, and fetch a list of existing reservations given a date range. Users must be unique by their email address and must be associated with reservations(you can find all api in the file openapi.yaml)

## Requirements

- Node.js (version 14 or higher)
- PostgreSQL
- TypeScript
- Git

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/Berheruben/Tot_backend_challenge.git
cd Tot_backend_challenge
```

### 2. Install Dependencies

Install the necessary npm packages:

```sh
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory of the project and add the following environment variables:

```sh
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
PORT=3000
```

### 4. Set Up the Database
Ensure you have PostgreSQL installed and running. Create the database and user with the credentials specified in the .env file.

You can use the following commands to set up the database:

```sh
CREATE DATABASE mydatabase;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
```
### 5. Build the Project
Compile the TypeScript code into JavaScript:

```sh
npm run build
```

### 6.Run Database Migrations

Run the initial migrations to set up the database schema:

```sh
npm run migration:run
```

### 7.Start the Application

Start the application:

```sh
npm start
```