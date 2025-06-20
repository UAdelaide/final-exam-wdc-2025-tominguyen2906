# Part 1: Node.js Express Application

This is a simple Node.js application built with the Express framework.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installing

1.  Navigate to the `part1` directory:
    ```bash
    cd part1
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the application, run the following command in the `part1` directory:

```bash
npm start
```

The application will start on `http://localhost:3000`.

## API Endpoints

*   `GET /`: Renders the home page.
*   `GET /users`: Responds with a simple string.
*   `GET /users/api/dogs`: Responds with a JSON object containing dog information.