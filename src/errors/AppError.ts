interface AppErrorProps {
    message: string;
    statusCode: number;
}

/**
 * Customized error class
 */
export class AppError {
    message: string;
    statusCode: number;

    /**
     * Creates an error message
     * @param message Text displayed on the error
     * @param statusCode Status code sent in the response 
     */
    constructor({message, statusCode}: AppErrorProps) {
        this.message = message;
        this.statusCode = statusCode;
    }
}