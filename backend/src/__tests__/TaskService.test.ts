import { TaskService } from '../services/TaskService';
import { taskModel } from '../models/TaskModel';
import { Task } from '../types';

import { beforeEach, describe, expect, it, type jest } from '@jest/globals';

// Mock the TaskModel
jest.mock('../models/TaskModel');
const mockTaskModel = taskModel as jest.Mocked<typeof taskModel>;

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const mockTask: Task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        createdAt: '2025-06-04T20:00:00.000Z',
        updatedAt: '2025-06-04T20:00:00.000Z'
      };

      mockTaskModel.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium'
      });

      expect(result).toEqual(mockTask);
      expect(mockTaskModel.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        dueDate: undefined
      });
    });

    it('should use default priority when not provided', async () => {
      const mockTask: Task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        completed: false,
        priority: 'medium',
        createdAt: '2025-06-04T20:00:00.000Z',
        updatedAt: '2025-06-04T20:00:00.000Z'
      };

      mockTaskModel.create.mockResolvedValue(mockTask);

      await taskService.createTask({
        title: 'Test Task'
      });

      expect(mockTaskModel.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: undefined,
        completed: false,
        priority: 'medium',
        dueDate: undefined
      });
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', async () => {
      const mockTask: Task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        completed: false,
        priority: 'medium',
        createdAt: '2025-06-04T20:00:00.000Z',
        updatedAt: '2025-06-04T20:00:00.000Z'
      };

      mockTaskModel.findById.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockTask);
      expect(mockTaskModel.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return null when task not found', async () => {
      mockTaskModel.findById.mockResolvedValue(null);

      const result = await taskService.getTaskById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const existingTask: Task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Original Task',
        completed: false,
        priority: 'low',
        createdAt: '2025-06-04T20:00:00.000Z',
        updatedAt: '2025-06-04T20:00:00.000Z'
      };

      const updatedTask: Task = {
        ...existingTask,
        title: 'Updated Task',
        completed: true,
        updatedAt: '2025-06-04T21:00:00.000Z'
      };

      mockTaskModel.findById.mockResolvedValue(existingTask);
      mockTaskModel.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask('123e4567-e89b-12d3-a456-426614174000', {
        title: 'Updated Task',
        completed: true
      });

      expect(result).toEqual(updatedTask);
      expect(mockTaskModel.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', {
        title: 'Updated Task',
        completed: true
      });
    });

    it('should return null when task does not exist', async () => {
      mockTaskModel.findById.mockResolvedValue(null);

      const result = await taskService.updateTask('nonexistent-id', {
        title: 'Updated Task'
      });

      expect(result).toBeNull();
      expect(mockTaskModel.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTaskModel.delete.mockResolvedValue(true);

      const result = await taskService.deleteTask('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBe(true);
      expect(mockTaskModel.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return false when task does not exist', async () => {
      mockTaskModel.delete.mockResolvedValue(false);

      const result = await taskService.deleteTask('nonexistent-id');

      expect(result).toBe(false);
    });
  });
});
