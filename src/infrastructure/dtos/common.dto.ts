// Common response interface for the usecases
export interface CommonResponse {
    success: boolean;
    message: string;
};

export interface ApiResponse<T = unknown> {
    success?: boolean;
    message?: string;
    totalPages?: number;
    currentPage?: number;
    totalCount?: number;
    data?: T;
}

// Common request interface for the usecases
export interface ApiPaginationRequest {
    page: number;
    limit: number;
}