import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import "express-async-errors"
import createConnection from "./database"
import { router } from './routes'
import { AppError } from './errors/AppError';

/**
 * Main Application file. Responsible for the
 * basic configuration and error handling
 */

// Creates database connections
createConnection();
const app = express();

// Teach connections how to use JSON and configure the routes
app.use(express.json());
app.use(router);

// Configure error handling with custom and default messages
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        });
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    });
});

// Export the application
export { app };