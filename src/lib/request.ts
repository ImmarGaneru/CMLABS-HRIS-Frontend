import { AxiosResponse } from 'axios';
import { ApiResponse, ErrorResponse } from './dto';
import { toast } from 'sonner';

export async function request<T>(
    promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> {
    try {
        const response = await promise;
        return response.data.data;
    } catch (error: any) {
        const err = error?.response?.data as ErrorResponse;
        console.error("Handled error:", err?.message || error.message);
        throw err;
    }
}