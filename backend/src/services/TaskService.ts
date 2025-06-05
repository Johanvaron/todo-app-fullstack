import { Task, TaskFilters, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { taskModel } from '../models/TaskModel';
import logger from '../utils/logger';

export class TaskService {
  async getAllTasks(filters?: TaskFilters, page: number = 1, limit: number = 10) {
    try {
      const result = await taskModel.findAll(filters, page, limit);
      const totalPages = Math.ceil(result.total / limit);
      
      return {
        tasks: result.tasks,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages
        }
      };
    } catch (error) {
      logger.error('Error getting all tasks:', error);
      throw new Error('Failed to retrieve tasks');
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      return await taskModel.findById(id);
    } catch (error) {
      logger.error(`Error getting task ${id}:`, error);
      throw new Error('Failed to retrieve task');
    }
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const newTask = await taskModel.create({
        title: taskData.title,
        description: taskData.description,
        completed: false,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate
      });
      
      return newTask;
    } catch (error) {
      logger.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task | null> {
    try {
      const existingTask = await taskModel.findById(id);
      if (!existingTask) {
        return null;
      }

      const updatedTask = await taskModel.update(id, taskData);
      
      if (updatedTask && taskData.completed !== undefined) {
        const status = taskData.completed ? 'completed' : 'reopened';
        logger.info(`Task ${id} ${status}`);
      }
      
      return updatedTask;
    } catch (error) {
      logger.error(`Error updating task ${id}:`, error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const deleted = await taskModel.delete(id);
      return deleted;
    } catch (error) {
      logger.error(`Error deleting task ${id}:`, error);
      throw new Error('Failed to delete task');
    }
  }

  async deleteCompletedTasks(): Promise<number> {
    try {
      const deletedCount = await taskModel.deleteCompleted();
      return deletedCount;
    } catch (error) {
      logger.error('Error deleting completed tasks:', error);
      throw new Error('Failed to delete completed tasks');
    }
  }

  async getTaskStats() {
    try {
      const { tasks } = await taskModel.findAll();
      
      const stats = {
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length,
        pending: tasks.filter(task => !task.completed).length,
        byPriority: {
          high: tasks.filter(task => task.priority === 'high').length,
          medium: tasks.filter(task => task.priority === 'medium').length,
          low: tasks.filter(task => task.priority === 'low').length
        },
        overdue: tasks.filter(task => 
          task.dueDate && 
          !task.completed && 
          new Date(task.dueDate) < new Date()
        ).length
      };
      
      return stats;
    } catch (error) {
      logger.error('Error getting task stats:', error);
      throw new Error('Failed to retrieve task statistics');
    }
  }
}

export const taskService = new TaskService();
