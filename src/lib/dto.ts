export interface ApiResponse<T> {
    status: string;
    message?: string;
    data: T;
}

export interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}