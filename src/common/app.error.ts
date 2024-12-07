export class AppError extends Error {
    public status: number;
    public code: string;
    public clientMessage: string;

    constructor(
        message: string,
        status: number = 500,
        code: string = 'INTERNAL_SERVER_ERROR',
        clientMessage: string = 'An unexpected error occurred. Please try again later.'
    ) {
        super(message);
        this.status = status;
        this.code = code;
        this.clientMessage = clientMessage;

        // Set the prototype explicitly to maintain the instanceof check
        Object.setPrototypeOf(this, AppError.prototype);
    }
}