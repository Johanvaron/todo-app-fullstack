import axios, { AxiosResponse } from 'axios';
import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  ApiResponse
} from '@/types';
import { API_CONFIG } from '@/config/api';

// Configuración base de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,  (error) => {
    console.error('API Error:', error);
    return Promise.reject(new Error(error.message || 'API Error'));
  }
);

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export class TasksAPI {
  // GET /api/tasks - Listar tareas
  static async getTasks(filters?: TaskFilters): Promise<Task[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.completed !== undefined) {
          params.append('completed', filters.completed.toString());
        }
        if (filters.priority) {
          params.append('priority', filters.priority);
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
        if (filters.dueDateFrom) {
          params.append('dueDateFrom', filters.dueDateFrom);
        }
        if (filters.dueDateTo) {
          params.append('dueDateTo', filters.dueDateTo);
        }
      }      const queryString = params.toString();
      const response: AxiosResponse<ApiResponse<Task[]>> = await api.get(
        `/tasks${queryString ? `?${queryString}` : ''}`
      );
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // GET /api/tasks/stats - Estadísticas
  static async getTaskStats(): Promise<TaskStats> {
    try {
      const response: AxiosResponse<ApiResponse<TaskStats>> = await api.get('/tasks/stats');
      return response.data.data || {
        total: 0,
        completed: 0,
        pending: 0,
        byPriority: { low: 0, medium: 0, high: 0 }
      };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  }

  // GET /api/tasks/:id - Obtener tarea
  static async getTask(id: string): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await api.get(`/tasks/${id}`);
      if (!response.data.data) {
        throw new Error('Task not found');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // POST /api/tasks - Crear tarea
  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await api.post('/tasks', taskData);
      if (!response.data.data) {
        throw new Error('Failed to create task');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // PUT /api/tasks/:id - Actualizar tarea
  static async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await api.put(`/tasks/${id}`, taskData);
      if (!response.data.data) {
        throw new Error('Failed to update task');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // DELETE /api/tasks/:id - Eliminar tarea
  static async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // DELETE /api/tasks - Eliminar completadas
  static async deleteCompletedTasks(): Promise<void> {
    try {
      await api.delete('/tasks');
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
      throw error;
    }
  }
}

export default TasksAPI;