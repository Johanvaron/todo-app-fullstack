export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

export interface APIResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface TaskFilters {
    searchText: string;
    status: 'all' | 'completed' | 'pending';
    priority: 'all' | 'low' | 'medium' | 'high';
    startDate?: Date;
    endDate?: Date;
}