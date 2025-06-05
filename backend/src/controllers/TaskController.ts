import { Request, Response } from 'express';
import { taskService } from '../services/TaskService';
import { ApiResponse, PaginatedResponse, Task } from '../types';
import { CreateTaskInput, UpdateTaskInput, TaskFiltersInput } from '../utils/validation';
import logger from '../utils/logger';

export class TaskController {  async getTasks(req: Request, res: Response<PaginatedResponse<Task>>): Promise<void> {
    try {
      const filters = req.query as unknown as TaskFiltersInput;
      const { page, limit, ...taskFilters } = filters;
      
      const result = await taskService.getAllTasks(taskFilters, page, limit);
      
      res.json({
        success: true,
        data: result.tasks,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getTasks controller:', error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      });
    }
  }
  async getTaskById(req: Request, res: Response<ApiResponse<Task>>): Promise<void> {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error('Error in getTaskById controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve task'
      });
    }
  }
  async createTask(req: Request, res: Response<ApiResponse<Task>>): Promise<void> {
    try {
      const taskData = req.body as CreateTaskInput;
      const newTask = await taskService.createTask(taskData);
      
      res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
      });
    } catch (error) {
      logger.error('Error in createTask controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }
  async updateTask(req: Request, res: Response<ApiResponse<Task>>): Promise<void> {
    try {
      const { id } = req.params;
      const taskData = req.body as UpdateTaskInput;
      
      const updatedTask = await taskService.updateTask(id, taskData);
      
      if (!updatedTask) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      logger.error('Error in updateTask controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update task'
      });
    }
  }

    async deleteTask(req: Request, res: Response<ApiResponse<null>>): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteTask controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      });
    }
  }
  async deleteCompletedTasks(req: Request, res: Response<ApiResponse<{ deletedCount: number }>>): Promise<void> {
    try {
      const deletedCount = await taskService.deleteCompletedTasks();
      
      res.json({
        success: true,
        data: { deletedCount },
        message: `${deletedCount} completed tasks deleted successfully`
      });
    } catch (error) {
      logger.error('Error in deleteCompletedTasks controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete completed tasks'
      });
    }
  }
  async getTaskStats(req: Request, res: Response<ApiResponse<any>>): Promise<void> {
    try {
      const stats = await taskService.getTaskStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error in getTaskStats controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve task statistics'
      });
    }
  }
}

export const taskController = new TaskController();
