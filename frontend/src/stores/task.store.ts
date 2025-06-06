import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters 
} from '@/types';
import { TasksAPI, type TaskStats } from '@/services/api';

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([]);
  const stats = ref<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    byPriority: { low: 0, medium: 0, high: 0 }
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<TaskFilters>({});

  // Computed
  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      if (filters.value.completed !== undefined && task.completed !== filters.value.completed) {
        return false;
      }
      if (filters.value.priority && task.priority !== filters.value.priority) {
        return false;
      }
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase();        return task.title.toLowerCase().includes(searchLower) ||
               task.description?.toLowerCase().includes(searchLower);
      }
      return true;
    });
  });

  const completedTasks = computed(() => tasks.value.filter(task => task.completed));
  const pendingTasks = computed(() => tasks.value.filter(task => !task.completed));
  const tasksByPriority = computed(() => ({
    high: tasks.value.filter(task => task.priority === 'high'),
    medium: tasks.value.filter(task => task.priority === 'medium'),
    low: tasks.value.filter(task => task.priority === 'low')
  }));

  // Actions
  const setError = (message: string | null) => {
    error.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  // Fetch all tasks
  const fetchTasks = async (queryFilters?: TaskFilters) => {
    try {
      loading.value = true;
      clearError();
      
      const fetchedTasks = await TasksAPI.getTasks(queryFilters);
      tasks.value = fetchedTasks;
      
      if (queryFilters) {
        filters.value = { ...queryFilters };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las tareas');
      console.error('Error fetching tasks:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch task statistics
  const fetchStats = async () => {
    try {
      const fetchedStats = await TasksAPI.getTaskStats();
      stats.value = fetchedStats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas');
      console.error('Error fetching stats:', err);
    }
  };

  // Get single task
  const fetchTask = async (id: string): Promise<Task | null> => {
    try {
      loading.value = true;
      clearError();
      
      const task = await TasksAPI.getTask(id);
      
      // Update task in local state if it exists
      const index = tasks.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks.value[index] = task;
      }
      
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la tarea');
      console.error('Error fetching task:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Create new task
  const createTask = async (taskData: CreateTaskRequest): Promise<Task | null> => {
    try {
      loading.value = true;
      clearError();
      
      const newTask = await TasksAPI.createTask(taskData);
      tasks.value.unshift(newTask); // Add to beginning of array
      
      // Refresh stats
      await fetchStats();
      
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarea');
      console.error('Error creating task:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Update existing task
  const updateTask = async (id: string, taskData: UpdateTaskRequest): Promise<Task | null> => {
    try {
      loading.value = true;
      clearError();
      
      const updatedTask = await TasksAPI.updateTask(id, taskData);
      
      // Update task in local state
      const index = tasks.value.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      
      // Refresh stats
      await fetchStats();
      
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la tarea');
      console.error('Error updating task:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string): Promise<boolean> => {
    const task = tasks.value.find(t => t.id === id);
    if (!task) return false;
    
    const success = await updateTask(id, { completed: !task.completed });
    return success !== null;
  };

  // Delete single task
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      loading.value = true;
      clearError();
      
      await TasksAPI.deleteTask(id);
      
      // Remove task from local state
      tasks.value = tasks.value.filter(task => task.id !== id);
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la tarea');
      console.error('Error deleting task:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Delete all completed tasks
  const deleteCompletedTasks = async (): Promise<boolean> => {
    try {
      loading.value = true;
      clearError();
      
      await TasksAPI.deleteCompletedTasks();
      
      // Remove completed tasks from local state
      tasks.value = tasks.value.filter(task => !task.completed);
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar las tareas completadas');
      console.error('Error deleting completed tasks:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: TaskFilters) => {
    filters.value = { ...newFilters };
  };

  // Clear filters
  const clearFilters = () => {
    filters.value = {};
  };

  // Initialize store
  const initialize = async () => {
    await Promise.all([
      fetchTasks(),
      fetchStats()
    ]);
  };

  return {
    // State
    tasks,
    stats,
    loading,
    error,
    filters,
    
    // Computed
    filteredTasks,
    completedTasks,
    pendingTasks,
    tasksByPriority,
    
    // Actions
    fetchTasks,
    fetchStats,
    fetchTask,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    deleteCompletedTasks,
    updateFilters,
    clearFilters,
    setError,
    clearError,
    initialize
  };
});