export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface TaskFilters {
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    search?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    byPriority: {
        low: number;
        medium: number;
        high: number;
    };
}